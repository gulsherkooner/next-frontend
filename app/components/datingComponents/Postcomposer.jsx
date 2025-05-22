import React, { useState } from 'react';
import { getCookie } from '../../lib/utils/cookie';
export default function PostComposerModal({ showPostModal, setShowPostModal ,Username}) {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // base64
      };
      reader.readAsDataURL(file);
    }
  };


  const removeImage = () => setImage(null);
  // console.log(Username);
  return (
    showPostModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/10">
        <div className="bg-white w-full max-w-md mx-auto rounded-2xl p-6 shadow-xl">
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
            <div>
              <div className="text-sm font-semibold">{Username}</div>
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
              onClick={async () => {
                if (!image) return;

                const accessToken = getCookie("accessToken"); // or however you get it
                const base64 = image;

                const postFile = {
                  image: base64,
                  type: 'image/jpeg',
                  name: `dating-post-${Date.now()}.jpg`
                };

                try {
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/dating-posts`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(postFile)
                  });

                  if (!res.ok) throw new Error("Upload failed");

                  const data = await res.json();
                  console.log("Post created:", data);
                  setShowPostModal(false);
                  setImage(null);
                } catch (err) {
                  console.error("Post error:", err);
                  alert("Failed to post image.");
                }
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
