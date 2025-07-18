import { useState } from "react";
import MultiStepForm from "./MultiStepWizard";

const CreateProfileBox = ({ onComplete }) => {
  return (
    <MultiStepForm onComplete={onComplete} />
  );
};

export default CreateProfileBox;