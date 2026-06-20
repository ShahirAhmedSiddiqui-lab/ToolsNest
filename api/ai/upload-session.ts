import type { ApiRequest, ApiResponse } from "../../server/http";
import { apiError, json, readJson, secureRequest } from "../../server/http";
import { cleanFileName, GEMINI_BASE, geminiKey } from "../../server/gemini";

const MAX_AI_FILE = 10 * 1024 * 1024;
const MIME_TYPES = new Set(["application/pdf", "text/plain"]);

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (!secureRequest(request, response, ["POST"])) return;
  try {
    const body = await readJson(request) as Record<string, unknown>;
    const fileName = cleanFileName(String(body.fileName ?? ""));
    const mimeType = String(body.mimeType ?? "");
    const size = Number(body.size);
    if (!MIME_TYPES.has(mimeType) || !Number.isSafeInteger(size) || size < 1 || size > MAX_AI_FILE) {
      json(response, 400, { error: { code: "INVALID_FILE", message: "Choose a PDF or plain-text file no larger than 10 MB." } });
      return;
    }
    const upstream = await fetch(`${GEMINI_BASE}/upload/v1beta/files`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": geminiKey(),
        "X-Goog-Upload-Protocol": "resumable",
        "X-Goog-Upload-Command": "start",
        "X-Goog-Upload-Header-Content-Length": String(size),
        "X-Goog-Upload-Header-Content-Type": mimeType,
        "X-Goog-Upload-File-Name": fileName,
      },
      body: JSON.stringify({ file: { display_name: fileName } }),
    });
    const uploadUrl = upstream.headers.get("x-goog-upload-url");
    if (!upstream.ok || !uploadUrl) throw new Error("UPLOAD_SESSION_FAILED");
    json(response, 200, { uploadUrl });
  } catch (error) { apiError(response, error); }
}
