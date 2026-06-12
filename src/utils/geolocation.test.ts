import { describe, expect, it } from "vitest";
import { getGeolocationErrorMessage } from "./geolocation";

describe("geolocation errors", () => {
  it("explains denied permissions", () => {
    expect(getGeolocationErrorMessage({ code: 1 })).toContain(
      "permission is blocked"
    );
  });

  it("distinguishes unavailable positions", () => {
    expect(getGeolocationErrorMessage({ code: 2 })).toContain(
      "could not determine"
    );
  });

  it("distinguishes timeouts", () => {
    expect(getGeolocationErrorMessage({ code: 3 })).toContain(
      "took too long"
    );
  });
});
