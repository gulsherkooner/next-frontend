import React, { useState } from 'react';

export default function PostComposerModal({ showPostModal, setShowPostModal }) {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => setImage(null);

  return (
    showPostModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/10">
        <div className="bg-white w-full max-w-md mx-auto rounded-2xl p-6 shadow-xl">
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
            <div>
              <div className="text-sm font-semibold">Username</div>
              <div className="text-xs text-gray-500">🌍 Public</div>
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="relative border-2 border-dashed border-gray-300 rounded-xl h-48 flex items-center justify-center mb-4 bg-gray-50">
            {image ? (
              <div className="relative w-full h-full">
                <img src={image} alt="preview" className="w-full h-full object-cover rounded-xl" />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white border rounded-full p-1 shadow hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-500">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div className="text-2xl">➕</div>
                <div className="text-sm mt-2 text-center">
                  Drag and drop images<br />or select from computer
                </div>
              </label>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowPostModal(false)}
              className="px-6 py-2 bg-gray-200 rounded-full text-sm font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowPostModal(false);
                // Optional: Trigger post logic here
              }}
              className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:opacity-90"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    )
  );
}
