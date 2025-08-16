import React from "react";

const NoEventsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <img
        src="/no-events.png" // Replace with your image or use an icon
        alt="No events"
        className="w-32 h-32 mb-4"
      />
      <h2 className="text-xl font-semibold text-gray-700">No Events Found</h2>
      <p className="text-gray-500 text-sm">
        Try changing the city or category to explore more events.
      </p>
    </div>
  );
};

export default NoEventsFound;
