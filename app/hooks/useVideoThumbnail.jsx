"use client";
import { useEffect, useState } from 'react';

function useVideoThumbnail(videoUrl) {
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (!videoUrl) return;

    const video = document.createElement('video');
    video.muted = true; // mute to prevent autoplay issues
    video.crossOrigin = 'anonymous'; // needed for cross-origin videos
    video.src = videoUrl;

    video.addEventListener('loadeddata', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnailUrl = canvas.toDataURL('image/jpeg');
      setThumbnail(thumbnailUrl);
    });

    return () => {
      video.remove(); // cleanup video element
    };
  }, [videoUrl]);

  return thumbnail;
}

export default useVideoThumbnail;
