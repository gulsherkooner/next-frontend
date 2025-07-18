import { useState } from "react";
import MultiStepForm from "./MultiStepWizard";

const CreateProfileBox = ({ onComplete }) => {
  const [showForm, setShowForm] = useState(false);
  return (
    <MultiStepForm onComplete={onComplete} />
  );
};

export default CreateProfileBox;