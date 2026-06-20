import type { IncomingMessage, ServerResponse } from "node:http";

export type ApiRequest = IncomingMessage & { body?: unknown };
export type ApiResponse = ServerResponse;

export const readJson = async (request: ApiRequest, limit = 128_000): Promise<unknown> => {
  if (request.body !== undefined) return request.body;
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > limit) throw new Error("REQUEST_TOO_LARGE");
    chunks.push(buffer);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

const allowedOrigins = () => {
  const values = new Set(["http://localhost:3000", "http://127.0.0.1:3000"]);
  if (process.env.APP_ORIGIN) values.add(process.env.APP_ORIGIN.replace(/\/$/, ""));
  if (process.env.VERCEL_URL) values.add(`https://${process.env.VERCEL_URL}`);
  return values;
};

export const secureRequest = (request: ApiRequest, response: ApiResponse, methods: string[]) => {
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "no-referrer");
  if (!methods.includes(request.method ?? "")) {
    json(response, 405, { error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed." } });
    return false;
  }
  const origin = request.headers.origin;
  if (origin && !allowedOrigins().has(origin.replace(/\/$/, ""))) {
    json(response, 403, { error: { code: "ORIGIN_DENIED", message: "Request origin is not allowed." } });
    return false;
  }
  return true;
};

export const json = (response: ApiResponse, status: number, body: unknown) => {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
};

export const apiError = (response: ApiResponse, error: unknown) => {
  const code = error instanceof Error && error.message === "REQUEST_TOO_LARGE" ? "REQUEST_TOO_LARGE" : "REQUEST_FAILED";
  const status = code === "REQUEST_TOO_LARGE" ? 413 : 500;
  json(response, status, { error: { code, message: code === "REQUEST_TOO_LARGE" ? "Request payload is too large." : "The AI request could not be completed." } });
};
