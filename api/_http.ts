import { ApiServiceError } from "../server/weather-api";

export interface ApiRequest {
  method?: string;
  query: Record<string, string | string[] | undefined>;
}

export interface ApiResponse {
  status(code: number): ApiResponse;
  json(payload: unknown): void;
  setHeader(name: string, value: string): void;
}

export function getQueryValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export function sendApiError(response: ApiResponse, error: unknown): void {
  const status = error instanceof ApiServiceError ? error.status : 500;
  const message =
    error instanceof ApiServiceError
      ? error.message
      : "The weather service is currently unavailable.";

  response.status(status).json({ error: message });
}

export function allowGetOnly(request: ApiRequest, response: ApiResponse): boolean {
  response.setHeader("Cache-Control", "no-store");

  if (request.method && request.method !== "GET") {
    response.status(405).json({ error: "Method not allowed." });
    return false;
  }

  return true;
}
