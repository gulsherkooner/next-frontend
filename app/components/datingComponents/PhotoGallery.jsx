'use client';

import { useState } from 'react';
import { Lock, Pin, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PhotoGallery({ profile = { name: 'username' } }) {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const allImages = [
    "https://images.unsplash.com/photo-1595152772835-219674b2a8a6",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c"
  ];

  // Shuffle and pick 6 random images
  const images = [...allImages]
    .sort(() => 0.5 - Math.random())  // simple shuffle
    .slice(0, 6);                       // pick first 6
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    if (index >= 2) {
      setShowRequestModal(true);
    } else {
      setShowPreviewModal(true);
    }
  };

  const goToPrev = () => {
    if (selectedImageIndex > 0) {
      const newIndex = selectedImageIndex - 1;
      setSelectedImageIndex(newIndex);
      if (newIndex >= 2) {
        setShowPreviewModal(false);
        setShowRequestModal(true);
      }
    }
  };

  const goToNext = () => {
    if (selectedImageIndex < images.length - 1) {
      const newIndex = selectedImageIndex + 1;
      setSelectedImageIndex(newIndex);
      if (newIndex >= 2) {
        setShowPreviewModal(false);
        setShowRequestModal(true);
      }
    }
  };

  return (
    <>
      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => handleImageClick(i)}
            className="relative aspect-square bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
          >
            <img src={img} alt={`Image ${i + 1}`} className="object-cover w-full h-full rounded-lg" />
            <Pin className="absolute top-4 right-4 text-gray-400 w-5 h-5 rotate-45 fill-black" />
            {i >= 2 && (
              <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
                <Lock className="w-6 h-6 text-gray-500" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Preview Modal with Arrows */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <button
            onClick={() => setShowPreviewModal(false)}
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-white hover:text-black transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Previous Arrow */}
          {selectedImageIndex > 0 && (
            <button onClick={goToPrev} className="absolute left-6 text-white hover:text-gray-300">
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          <img
            src={images[selectedImageIndex]}
            alt="Preview"
            className="w-full max-w-3xl max-h-[80vh] object-contain rounded-xl shadow-lg"
          />

          {/* Next Arrow */}
          {selectedImageIndex < images.length - 1 && (
            <button onClick={goToNext} className="absolute right-6 text-white hover:text-gray-300">
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}

      {/* Request to Unlock Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
          <div className="bg-white w-full max-w-md mx-auto rounded-2xl p-6 text-center shadow-xl relative">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Unlock with Request</h2>
            <p className="text-gray-700 mb-6 text-sm">
              This image has been set to private by the user. To gain access, please send a request.
              You will be able to view the image once the user approves your request.
            </p>
            <button
              onClick={() => {
                setShowRequestModal(false);
                // Trigger request logic here
              }}
              className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:opacity-90"
            >
              Send request
            </button>
          </div>
        </div>
      )}
    </>
  );
}
