import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import toast, { Toaster } from 'react-hot-toast';
import { getCookie } from '../../lib/utils/cookie';

export default function PostComposerModal({ showPostModal, setShowPostModal, profile }) {
  const [image, setImage] = useState(null); // raw image (base64)
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async (imageSrc, cropPixels) => {
    const createImage = (url) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
      });

    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // base64
        reader.readAsDataURL(blob);
      }, 'image/jpeg');
    });
  };

  const handleSubmit = async () => {
    if (!image || !croppedAreaPixels) return;

    setIsPosting(true);
    const accessToken = getCookie("accessToken");

    try {
      const croppedBase64 = await getCroppedImg(image, croppedAreaPixels);

      const postFile = {
        image: croppedBase64,
        type: 'image/jpeg',
        name: `dating-post-${Date.now()}.jpg`
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/dating-posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(postFile)
      });

      if (!res.ok) throw new Error('Upload failed');

      toast.success("Post uploaded successfully!");
      setImage(null);
      setCroppedImage(null);
      setShowPostModal(false);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload post.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    showPostModal && (
      <>
        <Toaster />
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/10">
          <div className="bg-white w-full max-w-md mx-auto rounded-2xl p-6 shadow-xl relative">
            {/* Header */}
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-2">
                <img
                  src={profile.profile_img_url[0]}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-semibold">{profile.firstName}</div>
                <div className="text-xs text-gray-500">🌍 Public</div>
              </div>
            </div>

            {/* Upload or Crop UI */}
            {image ? (
              <div className="relative w-full h-72 rounded-xl overflow-hidden bg-black mb-4">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setCroppedImage(null);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 text-black shadow"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 mb-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 text-gray-500">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div className="text-2xl">➕</div>
                <div className="text-sm mt-2 text-center">
                  Drag & drop or click to upload
                </div>
              </label>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPostModal(false)}
                className="px-6 py-2 bg-gray-200 rounded-full text-sm font-medium hover:bg-gray-300"
                disabled={isPosting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPosting || !image}
                className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:opacity-90 flex items-center gap-2"
              >
                {isPosting && (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="4" />
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {isPosting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </>
    )
  );
}
