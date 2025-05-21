import { useState } from "react";
import MultiStepForm from "./MultiStepWizard";

const CreateProfileBox = ({ onComplete }) => {
  const [showForm, setShowForm] = useState(false);

  const handleSignUpClick = () => {
    setShowForm(true);
  };

  if (showForm) {
    return <MultiStepForm onComplete={onComplete} />;
  }
  return (
    <div className="flex justify-center items-center min-h-[60vh] px-4">
      <div className="bg-gray-100 p-6 md:p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
          Create your profile
        </h2>
        <p className="text-sm text-gray-600 mb-5">
          Create your dating profile to explore connections, view profiles, and access all dating features. It only takes a minute—start your journey now!
        </p>
        <button
          className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition"
          onClick={handleSignUpClick}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default CreateProfileBox;