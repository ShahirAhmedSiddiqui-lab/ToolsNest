import { extractPdfPages, ExtractedPdfPage } from "../lib/pdfTools";

export type AIAction = "email" | "rewrite" | "grammar" | "quiz" | "content-calendar" | "cover-letter" | "resume-analysis" | "summary" | "document-chat";
export type ExtractedPdfDocument = {
  pageCount: number;
  fullText: string;
  summaryText: string;
  pages: ExtractedPdfPage[];
};

let aiHealthCache: boolean | null = null;
const AI_REQUEST_TIMEOUT_MS = 60_000;
const AI_HEALTH_TIMEOUT_MS = 8_000;

type GeminiPayload = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  text?: string;
};

const candidateText = (payload: GeminiPayload) => (
  payload.text
  || payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("")
  || ""
);

const responseError = async (response: Response) => {
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (contentType.includes("application/json")) {
    try {
      const body = await response.json() as { error?: { message?: string } };
      return body.error?.message || "The AI request failed.";
    } catch {
      return "The AI request failed.";
    }
  }
  try {
    const text = (await response.text()).trim();
    return text && !/^\s*</.test(text) ? text.slice(0, 240) : "The AI request failed.";
  } catch {
    return "The AI request failed.";
  }
};

const collectSseText = async (response: Response) => {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let output = "";
  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const lines = buffer.split("\n");
    buffer = done ? "" : lines.pop() ?? "";
    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      if (!line.startsWith("data:")) continue;
      try {
        const event = JSON.parse(line.slice(5).trimStart()) as GeminiPayload;
        output += candidateText(event);
      } catch { /* Ignore malformed SSE fragments. */ }
    }
    if (done) break;
  }
  return output.trim();
};

const collectAIText = async (response: Response) => {
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (contentType.includes("application/json")) {
    return candidateText(await response.json() as GeminiPayload).trim();
  }
  if (contentType.includes("text/event-stream")) return collectSseText(response);
  const text = (await response.text()).trim();
  return text && !/^\s*</.test(text) ? text : "";
};

export const requestAI = async (action: AIAction, input: Record<string, string | number | boolean>) => {
  try {
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, input }),
      signal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(await responseError(response));
    const text = await collectAIText(response);
    if (!text) throw new Error("The AI service returned an empty response.");
    return text;
  } catch (error) {
    if (error instanceof Error && ["TimeoutError", "AbortError"].includes(error.name)) {
      throw new Error("The AI request timed out. Please try again.");
    }
    if (error instanceof TypeError) {
      throw new Error("The AI service could not be reached. Check your connection and try again.");
    }
    throw error;
  }
};

export const getAIHealth = async (force = false) => {
  if (!force && aiHealthCache !== null) return aiHealthCache;
  const response = await fetch("/api/ai/health", {
    method: "GET",
    headers: { "Cache-Control": "no-store" },
    signal: AbortSignal.timeout(AI_HEALTH_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(await responseError(response));
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) throw new Error("AI health endpoint returned an invalid response.");
  const payload = await response.json() as { configured?: boolean };
  aiHealthCache = Boolean(payload.configured);
  return aiHealthCache;
};

export const aiErrorMessage = (error: unknown, fallback: string) => error instanceof Error && error.message
  ? error.message
  : fallback;

const normalizeSnippet = (value: string) => value.replace(/\s+/g, " ").trim();

export const extractPdfForAI = async (file: File): Promise<ExtractedPdfDocument> => {
  const pages = await extractPdfPages(file);
  const normalizedPages = pages
    .map((page) => ({ pageNumber: page.pageNumber, text: normalizeSnippet(page.text) }))
    .filter((page) => page.text);

  if (!normalizedPages.length) {
    throw new Error("No readable text was found in this PDF. Try a text-based PDF.");
  }

  const fullText = normalizedPages.map((page) => `[Page ${page.pageNumber}]\n${page.text}`).join("\n\n").slice(0, 24_000);
  const summaryText = normalizedPages.map((page) => `[Page ${page.pageNumber}] ${page.text}`).join("\n").slice(0, 16_000);
  return { pageCount: normalizedPages.length, fullText, summaryText, pages: normalizedPages };
};

const tokenScore = (source: string, queryTokens: string[]) => {
  const haystack = source.toLowerCase();
  return queryTokens.reduce((score, token) => score + (haystack.includes(token) ? token.length : 0), 0);
};

export const buildPdfQuestionContext = (document: ExtractedPdfDocument, question: string) => {
  const tokens = question.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [];
  const ranked = document.pages
    .map((page) => ({ ...page, score: tokenScore(page.text, tokens) }))
    .sort((left, right) => right.score - left.score || left.pageNumber - right.pageNumber)
    .slice(0, 4)
    .sort((left, right) => left.pageNumber - right.pageNumber);

  const excerpt = ranked.length > 0
    ? ranked.map((page) => `[Page ${page.pageNumber}]\n${page.text}`).join("\n\n")
    : document.summaryText;

  return excerpt.slice(0, 12_000);
};

export const generateContent = (prompt: string) => requestAI("email", { prompt });
export const generateContentStream = async (prompt: string) => new ReadableStream<string>({ start: async (controller) => { controller.enqueue(await generateContent(prompt)); controller.close(); } });
export const analyzeText = (text: string) => requestAI("resume-analysis", { text });
export const generateSummary = (text: string, maxLength = 200) => requestAI("summary", { text, maxLength });
export const enhanceText = (text: string, style: "formal" | "casual" | "professional" | "creative" = "professional") => requestAI("rewrite", { text, style });
export const fixGrammar = (text: string) => requestAI("grammar", { text });
export const generateQuizQuestions = (text: string, count = 5) => requestAI("quiz", { text, count });
export const generateContentCalendar = (topic: string, audience = "general audience", platform = "social media", days = 30) => requestAI("content-calendar", { topic, audience, platform, days });
export const analyzeResume = (resumeText: string, jobDescription = "") => requestAI("resume-analysis", { text: resumeText, jobDescription });
export const generateCoverLetter = (jobTitle: string, company: string, applicant: string, highlights = "") => requestAI("cover-letter", { jobTitle, company, applicant, highlights });
export default { generateContent, generateContentStream, analyzeText, generateSummary, enhanceText, fixGrammar, generateQuizQuestions, generateContentCalendar, analyzeResume, generateCoverLetter, extractPdfForAI, buildPdfQuestionContext, getAIHealth };
