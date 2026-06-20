export const GEMINI_BASE = "https://generativelanguage.googleapis.com";
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const geminiKey = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_NOT_CONFIGURED");
  return key;
};

export const cleanFileName = (value: string) => value.replace(/[^a-z0-9 _.-]/gi, "").slice(0, 100) || "document";

type Input = Record<string, string | number | boolean | undefined>;

const value = (input: Input, name: string, limit = 25_000) => String(input[name] ?? "").trim().slice(0, limit);

export const promptFor = (action: string, input: Input) => {
  const prompts: Record<string, () => string> = {
    email: () => `Write a polished professional email for this request. Return only the email.\n\nRequest:\n${value(input, "prompt")}`,
    rewrite: () => `Rewrite the text in a ${value(input, "style", 30) || "professional"} tone. Return only the rewritten text.\n\n${value(input, "text")}`,
    grammar: () => `Correct grammar, spelling, and punctuation. Return only the corrected text.\n\n${value(input, "text")}`,
    quiz: () => `Create ${Math.min(20, Math.max(1, Number(input.count) || 5))} multiple-choice questions with four options and an answer key from these notes:\n\n${value(input, "text")}`,
    "content-calendar": () => `Create a ${Math.min(90, Math.max(1, Number(input.days) || 30))}-day content calendar for ${value(input, "topic", 500)} on ${value(input, "platform", 100)}, targeting ${value(input, "audience", 300)}. Use a clear day-by-day format.`,
    "cover-letter": () => `Write a concise professional cover letter for ${value(input, "applicant", 200)} applying for ${value(input, "jobTitle", 200)} at ${value(input, "company", 200)}. Use these highlights:\n${value(input, "highlights", 10_000)}`,
    "resume-analysis": () => `Analyze ${value(input, "text") ? "this resume text" : "the attached resume"}${value(input, "jobDescription") ? " against the job description" : ""}. Give specific ATS, clarity, impact, and formatting improvements.\n\nResume text:\n${value(input, "text")}\n\nJob description:\n${value(input, "jobDescription")}`,
    summary: () => `Summarize ${value(input, "text") ? "the text below" : "the attached document"} with an executive summary, key points, important figures, and action items. Do not invent facts.\n\n${value(input, "text")}`,
    "document-chat": () => `Answer the question using only the attached document. If the answer is not present, say so.\n\nQuestion: ${value(input, "question", 4_000)}`,
  };
  const build = prompts[action];
  if (!build) throw new Error("INVALID_ACTION");
  const prompt = build();
  if (!prompt.trim() || prompt.length > 30_000) throw new Error("INVALID_INPUT");
  return prompt;
};

export const validGeminiFile = (file: unknown): file is { name: string; uri: string; mimeType: string } => {
  if (!file || typeof file !== "object") return false;
  const candidate = file as Record<string, unknown>;
  if (typeof candidate.name !== "string" || !/^files\/[a-zA-Z0-9_-]+$/.test(candidate.name)) return false;
  if (typeof candidate.mimeType !== "string" || !["application/pdf", "text/plain"].includes(candidate.mimeType)) return false;
  try {
    const uri = new URL(String(candidate.uri));
    return uri.protocol === "https:" && uri.hostname === "generativelanguage.googleapis.com";
  } catch { return false; }
};
