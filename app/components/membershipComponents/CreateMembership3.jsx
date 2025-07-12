import React, { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Plus } from "lucide-react";

const CreateMembership3 = ({ setCreateMemberBox, setSubscription, subscription }) => {
  const [introFile, setIntroFile] = useState(null);
  const [error, setError] = useState("");

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file.");
      return;
    }
    setIntroFile(file);
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file.");
      return;
    }
    setIntroFile(file);
    setError("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleNext = () => {
    if (!introFile) {
      setError("Please enter the video");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64Content = reader.result.split(",")[1];
      setSubscription({
        ...subscription,
        introVideo: {
          media_type: "video",
          media_name: introFile.name,
          media_content: base64Content,
        },
      });
      setCreateMemberBox(4);
    };
    reader.readAsDataURL(introFile);
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Step 2: Upload Intro post or video for Non-Subscribers
              </h2>
              <p className="text-md md:text-lg text-gray-600 leading-relaxed max-w-3xl">
                Let the user upload an intro video or image post with a short
                description, helping them understand what kind of exclusive
                content they’ll get.{" "}
              </p>
            </div>

            <div
              className="flex flex-col items-center justify-center py-12 px-4 bg-gray-200 rounded-md"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <label className="bg-white p-3 rounded-full mb-3 cursor-pointer">
                <Plus className="h-5 w-5" />
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <h3 className="font-medium text-sm">Drag and drop videos</h3>
              <p className="text-gray-600 text-xs">or select from computer</p>
              {introFile && (
                <div className="mt-4 text-green-700 text-sm">
                  Selected: {introFile.name}
                </div>
              )}
            </div>
              {error && (
                <div className="mt-2 text-red-600 text-sm">{error}</div>
              )}
          </div>

          {/* Next Button */}
          <div className="flex justify-start gap-3">
            <button
              onClick={() => setCreateMemberBox(2)}
              className="bg-gray-100 hover:bg-gray-200 font-semibold px-6 py-2 rounded-full text-md md:text-lg transition-colors duration-200 "
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2 rounded-full text-md md:text-lg transition-colors duration-200 "
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMembership3;
