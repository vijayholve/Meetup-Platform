import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../features/base/config";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

const getLabelText = (value) => `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;

const Comment = ({ comment, level = 0, eventId }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [reply, setReply] = useState("");

  const handleReplySubmit = async () => {
    if (!reply.trim()) return;

    try {
      await axios.post(
        `${API_ENDPOINTS.MAIN_URL}/events/${eventId}/comment/`,
        {
          content: reply,
          parent: comment.id,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("tokens"))?.access}`,
          },
        }
      );

      setReply("");
      setShowReplyBox(false);
      window.location.reload(); // Optional: replace with state update for better UX
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  return (
    <div
      className={`mt-4 p-4 rounded-lg bg-gray-50 shadow-sm ${
        level > 0 ? "border-l-4 border-blue-400 ml-4" : ""
      }`}
    >
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <strong className="text-blue-600">{comment.user?.username || "Anonymous"}</strong>
          <small className="text-gray-500">{new Date(comment.created_at).toLocaleString()}</small>
        </div>

        <p className="text-gray-800 mt-1">{comment.content}</p>

        {comment.user_rated && (
          <div className="mt-1">
            <Rating
              name="read-only"
              value={comment.user_rated}
              precision={0.5}
              readOnly
              emptyIcon={<StarIcon style={{ opacity: 0.4 }} fontSize="inherit" />}
            />
          </div>
        )}
      </div>

      <button
        onClick={() => setShowReplyBox(!showReplyBox)}
        className="text-blue-600 text-sm hover:underline"
      >
        {showReplyBox ? "Cancel" : "Reply"}
      </button>

      {showReplyBox && (
        <div className="mt-3">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a reply..."
            className="w-full h-20 p-2 rounded border border-gray-300 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={handleReplySubmit}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      )}

      {/* Render replies recursively */}
      {comment.replies?.map((replyComment) => (
        <Comment
          key={replyComment.id}
          comment={replyComment}
          level={level + 1}
          eventId={eventId}
        />
      ))}
    </div>
  );
};

export default function CommentsSection({ eventId }) {
  const [comments, setComments] = useState([]);
  const tokens = JSON.parse(localStorage.getItem("tokens"));
  const access = tokens?.access;

  useEffect(() => {
    axios
      .get(`${API_ENDPOINTS.MAIN_URL}/events/${eventId}/comment/`, {
        headers: { Authorization: `Bearer ${access}` },
      })
      .then((res) => setComments(res.data.data))
      .catch((err) => console.error("Failed to fetch comments:", err));
  }, [eventId]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Comments</h2>

      {comments.length === 0 ? (
        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} eventId={eventId} />
        ))
      )}
    </div>
  );
}
