import axios from "axios";
import React, { useEffect } from "react";
import { API_ENDPOINTS, API_EVENT } from "../../../features/base/config";
import { useNavigate } from "react-router-dom";
import { getValidAccessToken } from "../../../auth/AccessToken";

const EventCommentsList = ({ event_id }) => {
  const navigate = useNavigate();
  const [comments, setComments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const handleDelete = async (commentid) => {
    try {
      console.log(commentid)
      setDeleteLoading(true);
            const access = await getValidAccessToken(navigate);

      await axios.delete(`${API_ENDPOINTS.MAIN_URL}/api/event/single-Comment/${commentid}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      setComments(comments.filter((e) => e.id !== commentid));
      setDeleteLoading(false);
      console.log("Deleted successfully.");
    } catch (error) {
      console.error("Error deleting category:", error);
      setDeleteLoading(false);
    }
  };
  useEffect(() => {
    const fetchCommentEvents = async () => {
      if (!event_id) {
        setLoading(false);
        setError("No event ID provided for comments.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching comments for event ID: ${event_id}`);
        const access = await getValidAccessToken(navigate);

        const response = await axios.get(
          `${API_ENDPOINTS.MAIN_URL}/api/event/Comments/${event_id}/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
              "Content-Type": "application/json",
            },
          }
        );

        // --- LOGGING FOR DEBUGGING ---
        console.log(
          "Full comments API response object (EventCommentsList):",
          response.data
        );
        console.log(
          "Comments data path (response.data.data.comments):",
          response.data?.data?.comments
        );

        // --- LOGIC CONFIRMED BY YOUR PROVIDED API RESPONSE ---
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.comments)
        ) {
          setComments(response.data.data.comments);
        } else {
          console.warn(
            "Unexpected response structure for comments:",
            response.data
          );
          setComments([]);
          setError("Received unexpected data format for comments.");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Failed to load comments. Please try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCommentEvents();
  }, [event_id, navigate]);

  if (loading || deleteLoading) {
    return <div className="text-gray-600">Loading comments...</div>;
  }

  if (error) {
    return <div className="text-red-500 mt-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 sm:p-8 font-inter">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 transform hover:scale-100 transition-transform duration-300 ease-in-out">
        {/* Section Heading - Responsive font size */}
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-tight">
          Community Thoughts
        </h3>

        {/* Loading, Error, or Comments */}
        {loading ? (
          <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xl sm:text-2xl text-gray-500 font-semibold mb-2">
              Loading comments...
            </p>
            <div className="flex justify-center items-center mt-4">
              {/* Simple loading spinner */}
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        ) : error && comments.length === 0 ? ( // Display error only if no comments were loaded (initial error)
          <div className="text-center py-8 sm:py-12 bg-red-50 rounded-xl border border-red-200">
            <p className="text-xl sm:text-2xl text-red-700 font-semibold mb-2">
              Error!
            </p>
            <p className="text-base sm:text-lg text-red-500">{error}</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xl sm:text-2xl text-gray-500 font-semibold mb-2">
              No comments yet!
            </p>
            <p className="text-base sm:text-lg text-gray-400">
              Be the first to share your thoughts.
            </p>
          </div>
        ) : (
          <ul className="space-y-4 sm:space-y-6">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-md
                           hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
              >
                <div className="flex items-start mb-3 sm:mb-4">
                  {/* User Avatar Placeholder - Responsive size */}
                  {/* <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center text-lg sm:text-xl mr-3 sm:mr-4 shadow-inner">
                    {comment.user ? comment.user.charAt(0).toUpperCase() : '?'}
                  </div> */}
                  <div>
                    {/* Comment Content - Responsive font size */}
                    <p className="font-semibold text-base sm:text-lg text-gray-800 leading-relaxed mb-1 sm:mb-2">
                      {comment.content}
                    </p>
                    {/* User and Timestamp - Responsive font size */}
                    <p className="text-xs sm:text-sm text-gray-500">
                      <span className="font-medium text-gray-600">
                        {comment.user.username || "Anonymous"}
                      </span>{" "}
                      &bull;{" "}
                      <span className="text-gray-400">
                        {comment.created_at
                          ? new Date(comment.created_at).toLocaleString()
                          : "Date unavailable"}
                      </span>
                    </p>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventCommentsList;
