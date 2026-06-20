import type { ApiRequest, ApiResponse } from "../../server/http";
import { apiError, json, readJson, secureRequest } from "../../server/http";
import { GEMINI_BASE, GEMINI_MODEL, geminiKey, promptFor, validGeminiFile } from "../../server/gemini";

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (!secureRequest(request, response, ["POST"])) return;
  try {
    const body = await readJson(request, 128_000) as Record<string, unknown>;
    const action = String(body.action ?? "");
    const input = body.input && typeof body.input === "object" ? body.input as Record<string, string | number | boolean> : {};
    const prompt = promptFor(action, input);
    const parts: Array<Record<string, unknown>> = [{ text: prompt }];
    if (body.file !== undefined) {
      if (!validGeminiFile(body.file)) {
        json(response, 400, { error: { code: "INVALID_FILE_REFERENCE", message: "The document reference is invalid." } });
        return;
      }
      parts.unshift({ fileData: { fileUri: body.file.uri, mimeType: body.file.mimeType } });
    }
    const upstream = await fetch(`${GEMINI_BASE}/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:streamGenerateContent?alt=sse`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": geminiKey() },
      body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: { temperature: action === "grammar" ? 0.1 : 0.5, maxOutputTokens: 2048 } }),
    });
    if (!upstream.ok || !upstream.body) {
      json(response, upstream.status >= 400 && upstream.status < 500 ? 400 : 502, { error: { code: "AI_UPSTREAM_ERROR", message: "The AI service rejected the request." } });
      return;
    }
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    response.setHeader("Connection", "keep-alive");
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
    apiError(response, error);
  }
}
