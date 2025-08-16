import React from "react";

const DashBox = ({ title, total_number, icon="bi bi-people-fill" }) => {
  return (
    <div className="w-full sm:w-1/2 lg:w-1/4 p-2">
      <div className="bg-white rounded-2xl shadow-lg p-6 transition-transform transform hover:scale-[1.02] hover:shadow-xl h-full">
        <div className="flex items-center justify-between mb-4">
          {/* Left: Title & Number */}
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <h4 className="text-3xl font-bold text-gray-800 mt-1">{total_number}</h4>
          </div>

          {/* Right: Icon */}
          {/* <div className="bg-blue-100 text-blue-600 rounded-full p-3">
            <i className={`${icon} text-xl`}></i>
          </div> */}
        </div>

        {/* Optional Footer Text */}
        <div className="text-xs text-gray-400 pt-2 border-t mt-4">
          Updated just now
        </div>
      </div>
    </div>
  );
};

export default DashBox;
