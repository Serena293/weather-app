type ApiErrorPayload = {
  error?: unknown;
  message?: unknown;
};

export function getApiErrorMessage(
  payload: unknown,
  fallback: string
): string {
  if (!payload || typeof payload !== "object") return fallback;

  const { error, message } = payload as ApiErrorPayload;

  if (typeof error === "string" && error.trim()) return error;
  if (typeof message === "string" && message.trim()) return message;

  if (error && typeof error === "object") {
    const nestedMessage = (error as { message?: unknown }).message;
    if (typeof nestedMessage === "string" && nestedMessage.trim()) {
      return nestedMessage;
    }
  }

  return fallback;
}
