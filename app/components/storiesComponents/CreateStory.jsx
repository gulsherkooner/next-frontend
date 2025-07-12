import React, { useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { useDispatch } from "react-redux";
import { createStory } from "../../features/stories/storiesslice";

const CreateStory = ({ onClose }) => {
  const [storyFile, setStoryFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const isMobile = useIsMobile();
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file.");
      return;
    }
    setStoryFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file.");
      return;
    }
    setStoryFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCreate = async () => {
    if (!storyFile) return;
    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Content = reader.result.split(",")[1];
        const video = {
          media_name: storyFile.name,
          media_content: base64Content,
        };
        try {
          await dispatch(createStory({ video })).unwrap();
          setLoading(false);
          setStoryFile(null);
          if (onClose) onClose();
        } catch (err) {
          setLoading(false);
          setError(err.message || "Failed to create story");
        }
      };
      reader.onerror = () => {
        setLoading(false);
        setError("Failed to read video file.");
      };
      reader.readAsDataURL(storyFile);
    } catch (err) {
      setLoading(false);
      setError("Failed to process video file.");
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg flex flex-col justify-center relative ${
        isMobile
          ? "fixed inset-0 w-full h-full max-w-none max-h-none z-50"
          : "max-w-xs w-full"
      }`}
      style={
        isMobile
          ? { aspectRatio: "9/16" }
          : { aspectRatio: "9/16", maxWidth: 380, maxHeight: 720 }
      }
    >
      {/* X Button at top right inside the container */}
      <button
        className="absolute top-3 right-3 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
        aria-label="Close"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      <div
        className="flex flex-col items-center justify-center py-8 px-2 bg-gray-300 rounded-md w-full h-full relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{ height: "100%" }}
      >
        {error && (
          <div className="mb-2 text-red-500 text-sm">{error}</div>
        )}
        {!storyFile && (
          <>
            <h3 className="font-medium text-sm mb-2">Create story</h3>
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
          </>
        )}
        {storyFile && (
          <>
            <video
              ref={videoRef}
              key={storyFile.name}
              className="absolute inset-0 w-full h-full object-center object-contain md:rounded-lg"
              autoPlay
              loop
              playsInline
              preload="metadata"
              style={{ aspectRatio: "9/16" }}
              controls
              src={URL.createObjectURL(storyFile)}
            />
            {/* Create button at bottom right */}
            <button
              className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-lg transition"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateStory;
