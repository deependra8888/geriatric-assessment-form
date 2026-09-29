import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { MantineProvider } from "@mantine/core";
import { AssessmentForm } from "./features/assessment/AssessmentForm";

export function App() {
  return (
    <MantineProvider>
      <AssessmentForm />
    </MantineProvider>
  );
}
