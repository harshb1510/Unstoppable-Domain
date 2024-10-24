import React from 'react';

const VideoFeed = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Video Feed</h1>
      <div className="w-full max-w-4xl">
        <img
          src="http://127.0.0.1:8000/video_feed"
          alt="Video Feed"
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default VideoFeed;
