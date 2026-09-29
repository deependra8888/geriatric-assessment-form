import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import type { FormErrors } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import dayjs from "dayjs";
import { useState } from "react";
import { assessmentSchema, MOBILITY, type Assessment } from "./schema";

type FormValues = Omit<
  Assessment,
  | "dateOfBirth"
  | "assessmentDate"
  | "followUpDate"
  | "barthelIndex"
  | "medicationCount"
  | "mobility"
  | "consentObtained"
> & {
  dateOfBirth: string;
  assessmentDate: string;
  followUpDate: string;
  barthelIndex: number | "";
  medicationCount: number | "";
  mobility: Assessment["mobility"] | "";
  consentObtained: boolean;
};

const samplePatient: FormValues = {
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
};
const emptyValues: FormValues = {
  mrn: "",
  patientName: "",
  dateOfBirth: "",
  assessmentDate: "",
  mobility: "",
  barthelIndex: "",
  medicationCount: "",
  pharmacistReviewRequested: false,
  followUpDate: "",
  consentObtained: false,
};

const label = (value: string) =>
  value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export function AssessmentForm({
  onSave,
}: {
  onSave?: (assessment: Assessment) => void;
}) {
  const [savedAssessment, setSavedAssessment] = useState<Assessment | null>(
    null,
  );
  // Mantine 8.3's built-in resolver models Zod 3 (`error.errors`), while this task requires Zod 4 (`error.issues`).
  // Adapt only the error container so Mantine can render the exact issues produced by the supplied schema.
  const resolverSchema = {
    safeParse: (values: FormValues) => {
      const result = assessmentSchema.safeParse(values);
      return result.success
        ? result
        : { success: false as const, error: { errors: result.error.issues } };
    },
  };
  const validate = zodResolver(resolverSchema as never) as (
    values: FormValues,
  ) => FormErrors;
  const form = useForm<FormValues>({
    initialValues: emptyValues,
    validateInputOnBlur: true,
    validate,
  });
  const today = dayjs().format("YYYY-MM-DD");
  const dateOfBirthProps = form.getInputProps("dateOfBirth");
  const assessmentDateProps = form.getInputProps("assessmentDate");
  const followUpDateProps = form.getInputProps("followUpDate");
  const submit = (values: FormValues) => {
    const parsed = assessmentSchema.parse(values);
    form.setSubmitting(true);
    window.setTimeout(() => {
      setSavedAssessment(parsed);
      onSave?.(parsed);
      form.setSubmitting(false);
    }, 800);
  };

  return (
    <Container size="md" py="xl">
      <Paper withBorder shadow="sm" p="xl">
        <form onSubmit={form.onSubmit(submit)}>
          <Stack>
            <Title order={1}>Geriatric Care Assessment</Title>
            <TextInput
              label="Medical record number"
              placeholder="MRN-004821"
              {...form.getInputProps("mrn")}
            />
            <TextInput
              label="Patient name"
              {...form.getInputProps("patientName")}
            />
            <DateInput
              label="Date of birth"
              value={form.values.dateOfBirth || null}
              onChange={(value) =>
                form.setFieldValue("dateOfBirth", value ?? "")
              }
              onBlur={dateOfBirthProps.onBlur}
              error={form.errors.dateOfBirth}
              valueFormat="YYYY-MM-DD"
            />
            <DateInput
              label="Assessment date"
              maxDate={dayjs(today).toDate()}
              value={form.values.assessmentDate || null}
              onChange={(value) =>
                form.setFieldValue("assessmentDate", value ?? "")
              }
              onBlur={assessmentDateProps.onBlur}
              error={form.errors.assessmentDate}
              valueFormat="YYYY-MM-DD"
            />
            <Select
              label="Mobility"
              data={MOBILITY.map((value) => ({ value, label: label(value) }))}
              {...form.getInputProps("mobility")}
            />
            <NumberInput
              label="Barthel Index"
              min={0}
              max={100}
              step={5}
              {...form.getInputProps("barthelIndex")}
            />
            <NumberInput
              label="Regular medications"
              min={0}
              max={30}
              {...form.getInputProps("medicationCount")}
            />
            <Checkbox
              label="Pharmacist review requested"
              {...form.getInputProps("pharmacistReviewRequested", {
                type: "checkbox",
              })}
            />
            <DateInput
              label="Next review date"
              value={form.values.followUpDate || null}
              onChange={(value) =>
                form.setFieldValue("followUpDate", value ?? "")
              }
              onBlur={followUpDateProps.onBlur}
              error={form.errors.followUpDate}
              valueFormat="YYYY-MM-DD"
            />
            <Checkbox
              label="Consent obtained"
              {...form.getInputProps("consentObtained", { type: "checkbox" })}
            />
            <Button
              type="button"
              variant="light"
              onClick={() => form.setValues(samplePatient)}
            >
              Load sample patient
            </Button>
            <Button type="submit" loading={form.submitting}>
              Save assessment
            </Button>
            {savedAssessment && (
              <Alert title="Assessment saved successfully!" color="green">
                <Code block>{JSON.stringify(savedAssessment, null, 2)}</Code>
              </Alert>
            )}
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
