import type { ApiRequest, ApiResponse } from "../../server/http";
import { json, secureRequest } from "../../server/http";
import { geminiModel, hasGeminiKey } from "../../server/gemini";

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (!secureRequest(request, response, ["GET"])) return;
  json(response, 200, {
    configured: hasGeminiKey(),
    model: geminiModel(),
  });
}
