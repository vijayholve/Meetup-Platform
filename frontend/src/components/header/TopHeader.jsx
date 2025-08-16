import React from "react";

const TopHeader = ({value,other}) => {
  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-indigo-800 border-b-2 border-indigo-400 pb-2">
       {value}
      </h2>
      {other &&
        <p className="text-gray-600 mb-4">
        {other}
      </p>
      }
    </>
  );
};

export default TopHeader;
