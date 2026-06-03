import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("Gemini API Key not configured. AI features will be limited.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const MODEL_NAME = "gemini-2.5-flash";

interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
}

/**
 * Generate content using Gemini API
 */
export async function generateContent(
  prompt: string,
  options: GenerateOptions = {}
): Promise<string> {
  if (!genAI) {
    throw new Error("Gemini API is not configured");
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const { temperature = 0.7, maxTokens = 2048 } = options;

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    });

    const result = response.response;
    return result.text() || "No response generated";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

/**
 * Generate content with streaming
 */
export async function generateContentStream(
  prompt: string,
  options: GenerateOptions = {}
): Promise<ReadableStream<string>> {
  if (!genAI) {
    throw new Error("Gemini API is not configured");
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const { temperature = 0.7, maxTokens = 2048 } = options;

    const stream = await model.generateContentStream({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    });

    return new ReadableStream({
      async start(controller) {
        for await (const chunk of stream.stream) {
          const text = chunk.text?.();
          if (text) {
            controller.enqueue(text);
          }
        }
        controller.close();
      },
    });
  } catch (error) {
    console.error("Gemini Stream API Error:", error);
    throw error;
  }
}

/**
 * Process and analyze text using AI
 */
export async function analyzeText(text: string): Promise<string> {
  const prompt = `Analyze and provide insights about the following text:\n\n${text}`;
  return generateContent(prompt, { temperature: 0.3 });
}

/**
 * Generate a summary using AI
 */
export async function generateSummary(text: string, maxLength: number = 200): Promise<string> {
  const prompt = `Please summarize the following text in approximately ${maxLength} words:\n\n${text}`;
  return generateContent(prompt, { temperature: 0.3, maxTokens: 500 });
}

/**
 * Enhance or rewrite text
 */
export async function enhanceText(
  text: string,
  style: "formal" | "casual" | "professional" | "creative" = "professional"
): Promise<string> {
  const styleGuide = {
    formal: "in a formal, academic tone",
    casual: "in a casual, friendly tone",
    professional: "in a professional, business tone",
    creative: "in a creative, engaging tone",
  };

  const prompt = `Rewrite the following text ${styleGuide[style]}:\n\n${text}`;
  return generateContent(prompt, { temperature: 0.7 });
}

/**
 * Fix grammar and spelling
 */
export async function fixGrammar(text: string): Promise<string> {
  const prompt = `Fix all grammar, spelling, and punctuation errors in the following text. Only return the corrected text without any explanation:\n\n${text}`;
  return generateContent(prompt, { temperature: 0.1 });
}

/**
 * Generate quiz questions from content
 */
export async function generateQuizQuestions(
  content: string,
  numberOfQuestions: number = 5
): Promise<string> {
  const prompt = `Generate ${numberOfQuestions} multiple-choice quiz questions based on the following content. Format each question with options A, B, C, D and the correct answer:\n\n${content}`;
  return generateContent(prompt, { temperature: 0.5 });
}

/**
 * Generate content calendar
 */
export async function generateContentCalendar(
  topic: string,
  audience = "general audience",
  platform = "social media",
  numberOfDays: number = 30
): Promise<string> {
  const prompt = `Generate a ${numberOfDays}-day content calendar for "${topic}" on ${platform}, targeting ${audience}. Format it as a daily plan with content ideas for each day.`;
  return generateContent(prompt, { temperature: 0.7 });
}

/**
 * Generate resume suggestions
 */
export async function analyzeResume(resumeText: string, jobDescription = ""): Promise<string> {
  const prompt = jobDescription.trim()
    ? `Analyze this resume against the job description and provide constructive, targeted feedback.\n\nResume:\n${resumeText}\n\nJob Description:\n${jobDescription}`
    : `Analyze this resume and provide constructive feedback for improvement:\n\n${resumeText}`;
  return generateContent(prompt, { temperature: 0.5 });
}

/**
 * Generate cover letter
 */
export async function generateCoverLetter(
  jobTitle: string,
  companyName: string,
  applicantName: string,
  resumeHighlights = ""
): Promise<string> {
  const prompt = `Generate a professional cover letter for ${applicantName} applying for the ${jobTitle} role at ${companyName}.\n\nResume Highlights:\n${resumeHighlights || "Not provided"}`;
  return generateContent(prompt, { temperature: 0.7 });
}

/**
 * Check if API is available
 */
export function isGeminiAvailable(): boolean {
  return !!API_KEY && !!genAI;
}

export default {
  generateContent,
  generateContentStream,
  analyzeText,
  generateSummary,
  enhanceText,
  fixGrammar,
  generateQuizQuestions,
  generateContentCalendar,
  analyzeResume,
  generateCoverLetter,
  isGeminiAvailable,
};
