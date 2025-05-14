export default function getCroppedImg(imageSrc, croppedAreaPixels, setCroppedImage) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        // Set the blob to setCroppedImage
        const croppedBlobUrl = URL.createObjectURL(blob);
        setCroppedImage(croppedBlobUrl);

        // Convert blob to Base64 and resolve
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result.split(",")[1]); // Base64 content
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(blob); // Convert blob to Base64
      }, "image/jpeg");
    };

    image.onerror = (error) => reject(error);
  });
}
