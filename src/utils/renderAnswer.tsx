import React from "react";
import { VIDEO_MAP } from "./videoMapper";

export const renderAnswer = (parsed: { text: string; videoId: string | null }) => {
  const videoUrl = parsed.videoId ? VIDEO_MAP[parsed.videoId] : null;
  
  return (
    <div className="flex flex-col gap-2">

      {/* ✅ Render normal response text */}
      {parsed.text && (
        <p className="text-sm font-inter whitespace-pre-line">
          {parsed.text}
        </p>
      )}

      {/* ✅ If video ID is detected, show clickable button */}
      {videoUrl && (
        <button
          onClick={() => window.open(videoUrl, "_blank")}
          className="px-3 py-2 bg-black text-white text-xs rounded-lg hover:bg-gray-800 transition-colors duration-200 font-inter mt-1"
        >
          🎥 Click here to watch video
        </button>
      )}
    </div>
  );
};
