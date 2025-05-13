import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../lib/utils/cropImage";
import { X, Plus } from "lucide-react";

const EditImage = ({
  imgBox,
  setImgBox,
  onSave,
}) => {
  const [postFile, setPostFile] = useState({
    blob: null,
    name: "",
    type: "",
    size: 0,
    lastModified: 0,
  });
  const [previewSrc, setPreviewSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  console.log("imageFile:", postFile);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPostFile({name: file.name, type: file.type, size: file.size, lastModified: file.lastModified});
      setPreviewSrc(URL.createObjectURL(file));
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImg = await getCroppedImg(previewSrc, croppedAreaPixels, setCroppedImage);
      // setCroppedImage(croppedImg);
      setPostFile({
        blob: croppedImg,
        name: postFile.name,
        type: postFile.type,
        size: postFile.size,
        lastModified: postFile.lastModified,
      });
    } catch (error) {
      console.error("Error cropping image", error);
    }
  };

  return (
    imgBox && (
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
          <button
            onClick={() => setImgBox(false)}
            className="absolute right-4 top-4 p-1 hover:bg-gray-200 rounded-full"
          >
            <X size={18} />
          </button>

          <h3 className="text-lg font-bold mb-4 text-center">Edit Image</h3>

          {croppedImage ? (
            <div className="flex flex-col items-center">
              <img
                src={croppedImage}
                alt="Cropped"
                className=" rounded-md object-cover mb-4"
              />
            </div>
          ) : previewSrc ? (
            <div className="relative w-full h-64 bg-gray-200 rounded-md overflow-hidden">
              <Cropper
                image={previewSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="rect"
              />
            </div>
          ) : (
            <label className="cursor-pointer">
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-200 rounded-md">
                <div className="bg-white p-3 rounded-full mb-3">
                  <Plus className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-sm">Drag and drop an image</h3>
                <p className="text-gray-600 text-xs">or select from computer</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </label>
          )}

          {previewSrc && (
            <div className="mt-4">
              <label className="flex items-center mb-2">
                <span className="text-sm font-medium text-gray-700 mr-3">
                  Zoom
                </span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </label>
              <div className="flex justify-between">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium"
                  onClick={() => {
                    setPreviewSrc(null);
                    setPostFile(null);
                  }}
                >
                  Remove Image
                </button>
                {croppedImage ? (
                  <button
                    className="bg-gray-800 text-white px-4 py-1.5 rounded-md text-sm font-medium"
                    onClick={() => {
                      onSave(postFile);
                      setImgBox(false);
                      setCroppedAreaPixels(null);
                      setPreviewSrc(null);
                      setCroppedImage(null);
                    }}
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    className="bg-gray-800 text-white px-4 py-1.5 rounded-md text-sm font-medium"
                    onClick={handleCrop}
                  >
                    Crop Image
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default EditImage;
