import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MantineProvider } from "@mantine/core";
import { AssessmentForm } from "./AssessmentForm";

describe("AssessmentForm", () => {
  afterEach(cleanup);

  it("loads the sample patient and saves parsed values", async () => {
    const save = vi.fn();
    render(
      <MantineProvider>
        <AssessmentForm onSave={save} />
      </MantineProvider>,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Load sample patient" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Save assessment" }),
    );
    expect(
      await screen.findByText("Assessment saved successfully!"),
    ).toBeInTheDocument();
    expect(save).toHaveBeenCalledWith({
      mrn: "MRN-004821",
      patientName: "Sushila Deshpande",
      dateOfBirth: "1949-03-12",
      assessmentDate: "2026-08-07",
      mobility: "cane",
      barthelIndex: 80,
      medicationCount: 3,
      pharmacistReviewRequested: false,
      followUpDate: "2026-09-04",
      consentObtained: true,
    });
  });

  it("shows exactly one required error for each required field on submit", async () => {
    render(
      <MantineProvider>
        <AssessmentForm />
      </MantineProvider>,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Save assessment" }),
    );

    expect(
      await screen.findAllByText(
        /Must look like|Patient name must|Date of birth is required|Assessment date is required|Select a mobility|Barthel Index score is required|Enter the number|Next review date is required|Consent must/,
      ),
    ).toHaveLength(9);
  });
});
