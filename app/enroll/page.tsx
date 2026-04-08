import { EnrollProvider } from "./EnrollContext";
import FormContainer from "./FormContainer";

export const metadata = {
  title: "Anmeldung starten | SSP Bruneck 1",
};

export default function EnrollPage() {
  return (
    <EnrollProvider>
      <FormContainer />
    </EnrollProvider>
  );
}
