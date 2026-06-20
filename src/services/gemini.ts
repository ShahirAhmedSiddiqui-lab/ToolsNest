export type AIAction = "email" | "rewrite" | "grammar" | "quiz" | "content-calendar" | "cover-letter" | "resume-analysis" | "summary" | "document-chat";
export type GeminiFile = { name: string; uri: string; mimeType: string };

const responseError = async (response: Response) => {
  try {
    const body = await response.json() as { error?: { message?: string } };
    return body.error?.message || "The AI request failed.";
  } catch { return "The AI request failed."; }
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
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const event = JSON.parse(line.slice(6)) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
        output += event.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
      } catch { /* Ignore malformed SSE fragments. */ }
    }
    if (done) break;
  }
  return output.trim();
};

export const requestAI = async (action: AIAction, input: Record<string, string | number | boolean>, file?: GeminiFile) => {
  const response = await fetch("/api/ai/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, input, file }) });
  if (!response.ok) throw new Error(await responseError(response));
  const text = await collectSseText(response);
  if (!text) throw new Error("The AI service returned an empty response.");
  return text;
};

export const uploadAIFile = async (file: File): Promise<GeminiFile> => {
  const session = await fetch("/api/ai/upload-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileName: file.name, mimeType: file.type || "application/octet-stream", size: file.size }) });
  if (!session.ok) throw new Error(await responseError(session));
  const { uploadUrl } = await session.json() as { uploadUrl?: string };
  if (!uploadUrl) throw new Error("The AI upload session could not be created.");
  const uploaded = await fetch(uploadUrl, { method: "POST", headers: { "X-Goog-Upload-Command": "upload, finalize", "X-Goog-Upload-Offset": "0", "Content-Type": file.type }, body: file });
  if (!uploaded.ok) throw new Error("The document upload failed.");
  const payload = await uploaded.json() as { file?: GeminiFile };
  if (!payload.file?.name || !payload.file.uri) throw new Error("The AI service returned an invalid file reference.");
  return payload.file;
};

export const deleteAIFile = async (file: GeminiFile) => {
  await fetch("/api/ai/file", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: file.name }), keepalive: true });
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
export const isGeminiAvailable = () => true;

export default { generateContent, generateContentStream, analyzeText, generateSummary, enhanceText, fixGrammar, generateQuizQuestions, generateContentCalendar, analyzeResume, generateCoverLetter, isGeminiAvailable };
