import { describe, expect, it } from "vitest";
import { getApiErrorMessage } from "./errors";

describe("API error messages", () => {
  it("reads string errors", () => {
    expect(getApiErrorMessage({ error: "Invalid key" }, "Fallback")).toBe(
      "Invalid key"
    );
  });

  it("reads nested error messages without producing object text", () => {
    expect(
      getApiErrorMessage({ error: { message: "Function failed" } }, "Fallback")
    ).toBe("Function failed");
  });

  it("uses the fallback for unknown objects", () => {
    expect(getApiErrorMessage({ error: {} }, "Fallback")).toBe("Fallback");
  });
});
