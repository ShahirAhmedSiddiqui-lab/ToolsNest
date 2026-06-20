import type { ApiRequest, ApiResponse } from "../../server/http";
import { apiError, json, readJson, secureRequest } from "../../server/http";
import { GEMINI_BASE, geminiKey } from "../../server/gemini";

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (!secureRequest(request, response, ["DELETE"])) return;
  try {
    const body = await readJson(request) as Record<string, unknown>;
    const name = String(body.name ?? "");
    if (!/^files\/[a-zA-Z0-9_-]+$/.test(name)) {
      json(response, 400, { error: { code: "INVALID_FILE_REFERENCE", message: "The document reference is invalid." } });
      return;
    }
    const upstream = await fetch(`${GEMINI_BASE}/v1beta/${name}`, { method: "DELETE", headers: { "X-Goog-Api-Key": geminiKey() } });
    if (!upstream.ok && upstream.status !== 404) throw new Error("DELETE_FAILED");
    json(response, 200, { deleted: true });
  } catch (error) { apiError(response, error); }
}
