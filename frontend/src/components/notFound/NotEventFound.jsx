import React from "react";
import { Link } from "react-router-dom"; // use this if using React Router

const NoEventsFound = () => {
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center bg-white">
      <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 tracking-wider">
        No Events Found
      </h1>
      <div className="bg-orange-500 text-white px-3 py-1 rounded mt-4 text-sm tracking-wide uppercase shadow-sm">
        Try adjusting your filters or check back later
      </div>
      <button className="mt-8">
        
        
      </button>
    </main>
  );
};
export default NoEventsFound;
