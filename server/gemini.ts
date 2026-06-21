export const GEMINI_BASE = "https://generativelanguage.googleapis.com";
export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

const configuredValue = (name: string) => process.env[name]?.trim() || "";

export const geminiModel = () => {
  const configured = configuredValue("GEMINI_MODEL");
  return /^[a-zA-Z0-9._-]+$/.test(configured) ? configured : DEFAULT_GEMINI_MODEL;
};

export const hasGeminiKey = () => Boolean(
  configuredValue("GEMINI_API_KEY") || configuredValue("VITE_GEMINI_API_KEY"),
);

export const geminiKey = () => {
  // Server-only compatibility for deployments that still use the old name.
  // New deployments must use GEMINI_API_KEY.
  const key = configuredValue("GEMINI_API_KEY") || configuredValue("VITE_GEMINI_API_KEY");
  if (!key) throw new Error("GEMINI_NOT_CONFIGURED");
  return key;
};

export const describeGeminiError = async (response: Response, fallback: string) => {
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

  if (contentType.includes("application/json")) {
    try {
      const payload = await response.json() as { error?: { message?: string; status?: string } };
      const message = payload.error?.message?.trim();
      if (message) return message;
      const status = payload.error?.status?.trim();
      if (status) return `${fallback} (${status})`;
    } catch {
      return fallback;
    }
    return fallback;
  }

  try {
    const text = (await response.text()).trim();
    if (!text || /^\s*</.test(text)) return fallback;
    return text.slice(0, 300);
  } catch {
    return fallback;
  }
};

type Input = Record<string, string | number | boolean | undefined>;

const value = (input: Input, name: string, limit = 25_000) => String(input[name] ?? "").trim().slice(0, limit);
const required = (input: Input, name: string, limit = 25_000) => {
  const result = value(input, name, limit);
  if (!result) throw new Error("INVALID_INPUT");
  return result;
};

export const promptFor = (action: string, input: Input) => {
  const prompts: Record<string, () => string> = {
    email: () => `Write a polished professional email for this request. Return only the email.\n\nRequest:\n${required(input, "prompt")}`,
    rewrite: () => `Rewrite the text in a ${value(input, "style", 30) || "professional"} tone. Return only the rewritten text.\n\n${required(input, "text")}`,
    grammar: () => `Correct grammar, spelling, and punctuation. Return only the corrected text.\n\n${required(input, "text")}`,
    quiz: () => `Create ${Math.min(20, Math.max(1, Number(input.count) || 5))} multiple-choice questions with four options and an answer key from these notes:\n\n${required(input, "text")}`,
    "content-calendar": () => `Create a ${Math.min(90, Math.max(1, Number(input.days) || 30))}-day content calendar for ${required(input, "topic", 500)} on ${required(input, "platform", 100)}, targeting ${required(input, "audience", 300)}. Use a clear day-by-day format.`,
    "cover-letter": () => `Write a concise professional cover letter for ${required(input, "applicant", 200)} applying for ${required(input, "jobTitle", 200)} at ${required(input, "company", 200)}. Use these highlights:\n${value(input, "highlights", 10_000)}`,
    "resume-analysis": () => `Analyze this resume text${value(input, "jobDescription") ? " against the job description" : ""}. Give specific ATS, clarity, impact, and formatting improvements.\n\nResume text:\n${required(input, "text")}\n\nJob description:\n${value(input, "jobDescription", 15_000)}`,
    summary: () => `Summarize the provided document text in no more than ${Math.min(2_000, Math.max(50, Number(input.maxLength) || 300))} words with an executive summary, key points, important figures, and action items. Do not invent facts.\n\n${required(input, "text")}`,
    "document-chat": () => `Answer the question using only the document excerpt below. Cite page numbers when available. If the answer is not present, say so clearly.\n\nDocument excerpt:\n${required(input, "text", 20_000)}\n\nQuestion: ${required(input, "question", 4_000)}`,
  };
  const build = prompts[action];
  if (!build) throw new Error("INVALID_ACTION");
  const prompt = build();
  if (!prompt.trim() || prompt.length > 30_000) throw new Error("INVALID_INPUT");
  return prompt;
};
