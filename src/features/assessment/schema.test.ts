import { describe, expect, it } from "vitest";
import { assessmentSchema } from "./schema";

const values = {
  mrn: "MRN-004821",
  patientName: "Sushila Deshpande",
  dateOfBirth: "1966-08-07",
  assessmentDate: "2026-08-07",
  mobility: "cane" as const,
  barthelIndex: 80,
  medicationCount: 3,
  pharmacistReviewRequested: false,
  followUpDate: "2026-09-04",
  consentObtained: true as const,
};

describe("assessmentSchema", () => {
  it("accepts exactly 60 years old", () =>
    expect(assessmentSchema.safeParse(values).success).toBe(true));
  it("rejects one day short of 60", () =>
    expect(
      assessmentSchema.safeParse({ ...values, dateOfBirth: "1966-08-08" })
        .success,
    ).toBe(false));
  it.each([
    ["invalid MRN", { mrn: "MRN-4821" }, "mrn"],
    ["short name", { patientName: "S" }, "patientName"],
    ["invalid mobility", { mobility: "crutches" }, "mobility"],
    ["non-step Barthel score", { barthelIndex: 82 }, "barthelIndex"],
    ["out-of-range Barthel score", { barthelIndex: 105 }, "barthelIndex"],
    [
      "polypharmacy without review",
      { medicationCount: 5 },
      "pharmacistReviewRequested",
    ],
    ["same-day follow-up", { followUpDate: "2026-08-07" }, "followUpDate"],
    ["missing consent", { consentObtained: false }, "consentObtained"],
  ])("rejects %s on %s", (_description, change, path) => {
    const result = assessmentSchema.safeParse({ ...values, ...change });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues.some((issue) => issue.path[0] === path)).toBe(
        true,
      );
  });
});
