// 2. LiveStreams.js
// ==========================================
import React from "react";
import { Radio, WifiOff } from "lucide-react";

const LiveStreams = () => {
  return (
    <div className="min-h-screen bg-dark-400 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Radio className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-5xl font-bold mb-4 text-white">Live Streams</h1>
          <p className="text-gray-400 text-lg">
            Watch the best players from our community streaming live right now.
          </p>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20">
          <WifiOff className="w-24 h-24 text-gray-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-3">
            No One is Live Right Now
          </h2>
          <p className="text-gray-400 text-lg">
            Check back later or go live from your profile to be featured here!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveStreams;
