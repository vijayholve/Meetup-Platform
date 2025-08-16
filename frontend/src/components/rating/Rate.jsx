// src/components/rating/CommentsSection.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../features/base/config";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

// Import the new RatingSummary component
import RatingSummary from "./RatingSummary"; // Adjust path if RatingSummary.jsx is elsewhere

// Labels for rating values, ONLY INTEGER VALUES
const labels = {
  1: "Useless",
  2: "Poor",
  3: "Ok",
  4: "Good",
  5: "Excellent",
};

// Function to get accessible text for rating values
const getLabelText = (value) =>
  `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;

// Comment component (MODIFIED)
// src/components/rating/CommentsSection.js

// ... (existing imports and labels/getLabelText functions) ...

const Comment = ({ comment, level = 0, eventId, onCommentAction }) => {
  // Keeping visual distinctions for replies if they exist in data
  const inlineMarginStyle = { marginLeft: `${level * 3}rem` };
  const replyBgClass = level > 0 ? "bg-gray-50 border border-gray-200" : "bg-white shadow-md";
  const replyBorderClass = level > 0 ? "border-l-4 border-indigo-400" : "";

  return (
    <div
      className={`relative p-5 rounded-lg mb-4 transition-all duration-300 hover:shadow-lg
        ${level > 0 ? `${replyBorderClass}` : "shadow-md"}
        ${replyBgClass}
      `}
      style={level > 0 ? inlineMarginStyle : {}}
    >
      {level > 0 && (
        <div className="flex items-center text-sm text-indigo-700 mb-2 font-semibold">
          <i className="fas fa-reply mr-2 transform scale-x-[-1]"></i>
          Reply to {comment.parent_user_username || "previous comment"}
        </div>
      )}

      {/* MODIFIED: Place rating directly next to the username */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"> {/* New div to group username and rating */}
          <strong className="text-gray-900 text-lg font-extrabold">
            {comment.user?.username || "Anonymous"}
          </strong>
          
          {/* Author's rating for the event, displayed right after their name */}
          {comment.user_rated !== null && comment.user_rated !== undefined && (
            <Rating
              name={`read-only-rating-${comment.id}`}
              value={Math.round(parseFloat(comment.user_rated))}
              precision={1}
              readOnly
              emptyIcon={<StarIcon style={{ opacity: 0.4 }} fontSize="inherit" />}
              size="small"
              className="mt-0.5" // Adjust margin-top to align vertically with text
            />
          )}
        </div>
        
        <small className="text-gray-500 text-sm">
          {new Date(comment.created_at).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </small>
      </div>

      <p className="text-gray-700 text-base mb-3 leading-relaxed">
        {comment.content}
      </p>

      {/* The separate "Author's rating:" text below the comment content is now redundant */}
      {/*
      {comment.user_rated !== null && comment.user_rated !== undefined && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-600 font-medium">Author's rating:</span>
          <Rating
            name={`read-only-rating-${comment.id}`}
            value={Math.round(parseFloat(comment.user_rated))}
            precision={1}
            readOnly
            emptyIcon={<StarIcon style={{ opacity: 0.4 }} fontSize="inherit" />}
            size="small"
          />
          <span className="text-sm text-gray-600">
            {getLabelText(Math.round(parseFloat(comment.user_rated)))}
          </span>
        </div>
      )}
      */}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((replyComment) => (
            <Comment
              key={replyComment.id}
              comment={replyComment}
              level={level + 1}
              eventId={eventId}
              onCommentAction={onCommentAction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ... (rest of CommentsSection component remains the same)
// ... (rest of CommentsSection component remains the same)
  // Main CommentsSection component
  export default function CommentsSection({ eventId }) {
    const [comments, setComments] = useState([]);
    const [newCommentContent, setNewCommentContent] = useState("");
    const [newCommentRating, setNewCommentRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(-1);
    const [isPostingComment, setIsPostingComment] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [userExistingRating, setUserExistingRating] = useState(null);

    // State for rating summary data
    const [ratingSummary, setRatingSummary] = useState(null);

    // Function to fetch all necessary data: comments, user rating, and rating summary
    const fetchAllData = async () => {
      setFetchError("");
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const accessToken = tokens?.access;
        const headers = { Authorization: `Bearer ${accessToken}` };

        // 1. Fetch comments
        const commentsResponse = await axios.get(
          `${API_ENDPOINTS.MAIN_URL}/events/${eventId}/comment/`,
          { headers }
        );
        setComments(commentsResponse.data.data);

        // 2. Fetch the current user's rating for this event

        // 3. Fetch the event rating summary
        const summaryResponse = await axios.get(
          `${API_ENDPOINTS.MAIN_URL}/events/${eventId}/rating-summary/`
        );
        setRatingSummary(summaryResponse.data);
      } catch (err) {
        console.error(
          "Failed to fetch comments or overall event data:",
          err.response ? err.response.data : err.message,
          err
        );
        if (
          !err.response ||
          (err.response.status !== 401 && err.response.status !== 404)
        ) {
          setFetchError(
            "Failed to load comments and ratings. Please try again later."
          );
        }
        setUserExistingRating(null);
        setComments([]);
        setRatingSummary(null);
      }
    };

    useEffect(() => {
      fetchAllData();
      // setNewCommentContent({})
    }, [eventId]);

    const handlePostComment = async () => {
      if (!newCommentContent.trim() && newCommentRating === 0) {
        alert("Please enter a comment or select a rating.");
        return;
      }

      setIsPostingComment(true);
      try { 
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const accessToken = tokens?.access;
        const headers = { Authorization: `Bearer ${accessToken}` };

        if (newCommentContent.trim()) {
          await axios.post(
            `${API_ENDPOINTS.MAIN_URL}/events/${eventId}/comment/`,
            {
              content: newCommentContent.trim(),
            },
            {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        }
          );
        }

        // Ensure rating sent to backend is an integer
        if (
          newCommentRating > 0 &&
          (userExistingRating === null || newCommentRating !== userExistingRating)
        ) {
          await axios.post(
            `${API_ENDPOINTS.MAIN_URL}/events/${eventId}/rating/`,
            {
              rating: Math.round(newCommentRating), // Ensure rating sent is an integer
            },
            { headers }
          );
        }

        setNewCommentContent("");
        setNewCommentRating(0);
        setHoverRating(-1);
        fetchAllData();
      } catch (err) {
        console.error(
          "Failed to post comment or rating:",
          err.response ? err.response.data : err.message
        );
        alert("Failed to submit. Please try again.");
      } finally {
        setIsPostingComment(false);
      }
    };

    return (
      <div className="p-8 max-w-5xl mx-auto bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-2xl my-8">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 pb-4 border-b-2 border-indigo-400">
          Comments & Reviews
        </h2>

        {/* Render the extracted RatingSummary component here */}
        <RatingSummary ratingSummary={ratingSummary} />

        {/* New Comment/Review Input */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Leave a Comment or Rating
          </h3>
          <textarea
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            placeholder="Share your thoughts about this event..."
            rows="4"
            className="w-full p-3 mb-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y text-gray-800 transition-all duration-200"
          />
          {/* Conditionally render the rating input */}
          {userExistingRating === null ? (
            <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-4">
              <span className="text-gray-700 mr-3 font-medium mb-2 sm:mb-0">
                Rate this event:
              </span>
              <div className="flex items-center">
                <Rating
                  name="new-comment-rating"
                  value={newCommentRating}
                  precision={1} // <--- Key Change: Only allow integer steps for new rating
                  onChange={(event, newValue) => {
                    setNewCommentRating(newValue);
                  }}
                  onChangeActive={(event, newHover) => {
                    setHoverRating(newHover);
                  }}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.4 }} fontSize="inherit" />
                  }
                  size="large"
                />
                {newCommentRating !== null && (
                  <span className="ml-3 text-gray-600 text-sm font-medium">
                    {labels[hoverRating !== -1 ? hoverRating : newCommentRating]}
                  </span>
                )}
              </div>
            </div>
          ) : (
            // Existing Rating Display - Make it integer as well
            <div className="mb-4 text-gray-700 font-medium">
              You have already rated this event:{" "}
              <Rating
                value={Math.round(userExistingRating)} // Round to integer
                precision={1} // <--- Key Change: Only display full stars for existing rating
                readOnly
                emptyIcon={
                  <StarIcon style={{ opacity: 0.4 }} fontSize="inherit" />
                }
                size="medium"
              />
              <span className="ml-2 text-sm text-gray-600">
                {getLabelText(Math.round(userExistingRating))}{" "}
                {/* Use rounded value for label */}
              </span>
            </div>
          )}

          <button
            onClick={handlePostComment}
            disabled={
              isPostingComment ||
              (!newCommentContent.trim() &&
                (newCommentRating === 0 || userExistingRating !== null))
            }
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {isPostingComment ? "Posting..." : "Post Comment"}
          </button>
        </div>

        {fetchError && (
          <p className="text-lg text-red-600 py-6 text-center border-t border-gray-200 mt-8">
            {fetchError}
          </p>
        )}

        {!fetchError && comments.length === 0 ? (
          <p className="text-lg text-gray-600 py-6 text-center border-t border-gray-200 mt-8">
            No comments yet. Be the first to share your experience!
          </p>
        ) : (
          <div className="border-t border-gray-200 pt-8">
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                eventId={eventId}
                onCommentAction={fetchAllData}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
