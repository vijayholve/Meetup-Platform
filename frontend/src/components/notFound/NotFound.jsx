import React from "react";
import { Link } from "react-router-dom"; // use this if using React Router

const NotFoundPage = () => {
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center bg-white">
      <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 tracking-wider">
        No Page Found
      </h1>
      <div className="bg-orange-500 text-white px-3 py-1 rounded mt-4 text-sm tracking-wide uppercase shadow-sm">
        404
      </div>
    </main>
  );
};
export default NotFoundPage;
