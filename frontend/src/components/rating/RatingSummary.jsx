// src/components/rating/RatingSummary.jsx

import React from 'react';
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star"; // Corrected import path

// This component will receive ratingSummary as a prop
const RatingSummary = ({ ratingSummary }) => {
  // Ensure ratingSummary and total_ratings exist and are valid before rendering
  if (!ratingSummary || ratingSummary.total_ratings === 0) {
    return (
      <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200 text-center text-gray-600">
        No ratings yet for this event. Be the first to rate!
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Overall Event Rating</h3>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Section: Average Rating */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left p-4">
          <p className="text-6xl font-extrabold text-gray-900 mb-2">
            {ratingSummary.average_rating}
          </p>
          <Rating
            value={ratingSummary.average_rating}
            precision={0.5}
            readOnly
            emptyIcon={<StarIcon style={{ opacity: 0.4 }} fontSize="inherit" />}
            size="large" // Use 'large' for prominence
            className="mb-2"
          />
          <p className="text-lg text-gray-600">
            based on {ratingSummary.total_ratings} ratings
          </p>
          <p className="text-sm text-gray-500">
            (across all users for this event)
          </p>
        </div>

        {/* Right Section: Star Breakdown */}
        <div className="flex-1 w-full md:w-auto p-4">
          {/* Loop for 5-star down to 1-star */}
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingSummary.rating_counts[star] || 0; // Get count, default to 0
            const percentage = ratingSummary.total_ratings > 0
              ? (count / ratingSummary.total_ratings) * 100
              : 0;

            return (
              <div key={star} className="flex items-center mb-2 last:mb-0">
                <span className="font-semibold text-gray-800 mr-2">{star}</span>
                <StarIcon className="text-yellow-500 mr-2" fontSize="small" /> {/* Smaller star icon */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                  <div
                    className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-gray-700 font-medium w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-md text-gray-700 mt-6 pt-4 border-t border-gray-200">
        Group reviews are public to help members provide valuable feedback that can guide and inspire future events.
      </p>
    </div>
  );
};

export default RatingSummary;