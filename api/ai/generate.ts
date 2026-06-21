import type { ApiRequest, ApiResponse } from "../../server/http";
import { apiError, json, readJson, secureRequest } from "../../server/http";
import { describeGeminiError, GEMINI_BASE, geminiKey, geminiModel, promptFor } from "../../server/gemini";

const AI_TIMEOUT_MS = 55_000;

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (!secureRequest(request, response, ["POST"])) return;
  try {
    const body = await readJson(request, 128_000) as Record<string, unknown>;
    const action = String(body.action ?? "");
    if (!body.input || typeof body.input !== "object" || Array.isArray(body.input)) throw new Error("INVALID_INPUT");
    const rawInput = body.input as Record<string, unknown>;
    if (!Object.values(rawInput).every((item) => ["string", "number", "boolean"].includes(typeof item))) {
      throw new Error("INVALID_INPUT");
    }
    const input = rawInput as Record<string, string | number | boolean>;
    const prompt = promptFor(action, input);
    const parts: Array<Record<string, unknown>> = [{ text: prompt }];
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
    let upstream: Response;
    try {
      upstream = await fetch(`${GEMINI_BASE}/v1beta/models/${encodeURIComponent(geminiModel())}:streamGenerateContent?alt=sse`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Goog-Api-Key": geminiKey() },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
          generationConfig: {
            temperature: action === "grammar" ? 0.1 : 0.5,
            maxOutputTokens: ["quiz", "content-calendar"].includes(action) ? 4096 : 2048,
          },
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
    if (!upstream.ok || !upstream.body) {
      json(response, upstream.status === 429 ? 429 : 502, {
        error: {
          code: "AI_UPSTREAM_ERROR",
          message: await describeGeminiError(upstream, "The AI service rejected the request."),
        },
      });
      return;
    }
    response.statusCode = 200;
    response.setHeader("Content-Type", upstream.headers.get("content-type") || "text/event-stream; charset=utf-8");
    const reader = upstream.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      response.write(Buffer.from(value));
    }
    response.end();
  } catch (error) {
    if (error instanceof Error && ["INVALID_ACTION", "INVALID_INPUT"].includes(error.message)) {
      json(response, 400, { error: { code: error.message, message: "The requested AI action or input is invalid." } });
      return;
    }
    if (error instanceof Error && error.message === "GEMINI_NOT_CONFIGURED") {
      json(response, 503, { error: { code: error.message, message: "The AI service is not configured on this deployment." } });
      return;
    }
    if (error instanceof Error && error.name === "AbortError") {
      json(response, 504, { error: { code: "AI_TIMEOUT", message: "The AI service took too long to respond. Please try again." } });
      return;
    }
    apiError(response, error);
  }
}
