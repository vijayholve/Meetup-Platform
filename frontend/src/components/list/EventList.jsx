import React, { useEffect } from "react";
import { useEventContext } from "../../context/EventContext";
import Loading from "../loading/Loading";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, API_EVENT } from "../../features/base/config";
import axios from "axios";
import PageLoader from "../loading/PageLoader";
import { getValidAccessToken } from "../../auth/AccessToken";

const EventList = () => {
  const { events, loading, setEvents } = useEventContext();
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const handleDelete = async (eventId) => {
    try {
      setDeleteLoading(true);
      const access = await getValidAccessToken(navigate);

      await axios.delete(`${API_EVENT.GET_EVENTS}${eventId}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      // Filter out the deleted item from the local state
      setEvents(events.filter((e) => e.id !== eventId));
      setDeleteLoading(false);
      console.log("Deleted successfully.");
    } catch (error) {
      console.error("Error deleting event:", error);
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <Loading></Loading>;
  }
  if (deleteLoading) {
    return <PageLoader reason={"Deleting Event"} />;
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Event List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="py-3 px-4 border-b">id</th>

              <th className="py-3 px-4 border-b">Title</th>
              <th className="py-3 px-4 border-b">Organizer</th>

              <th className="py-3 px-4 border-b">Category</th>
              <th className="py-3 px-4 border-b">city</th>

              <th className="py-3 px-4 border-b">Venue</th>
              <th className="py-3 px-4 border-b">Start</th>
              <th className="py-3 px-4 border-b">End</th>
              <th className="py-3 px-4 border-b">Public</th>
              <th className="py-3 px-4 border-b">Banner</th>
              <th className="py-3 px-4 border-b">Comments</th>
              <th className="py-3 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{event.id}</td>
                <td className="py-3 px-4 border-b font-medium">
                  {event.title}
                </td>
                <td className="py-3 px-4 border-b font-medium">
                  {event.organizer?.username || "-"}
                </td>
                <td className="py-3 px-4 border-b">
                  {event.category?.name || "-"}
                </td>
                <td className="py-3 px-4 border-b">
                  {event.city?.name || "-"}
                </td>
                <td className="py-3 px-4 border-b">
                  {event.venue?.name || "-"}
                </td>
               
                <td className="py-3 px-4 border-b">
                  {new Date(event.start_time).toLocaleString()}
                </td>
                <td className="py-3 px-4 border-b">
                  {new Date(event.end_time).toLocaleString()}
                </td>
                <td className="py-3 px-4 border-b">
                  {event.is_public ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-red-600">No</span>
                  )}
                </td>
                <td className="py-3 px-4 border-b">
                  {event.banner_image ? (
                    <img
                      src={`${API_ENDPOINTS.MAIN_URL}${event.banner_image}`}
                      alt="Banner"
                      className="w-16 h-10 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
 <td className="py-3 px-4 border-b">
                  <Link to={`/dashboard/event/comments/${event.id}`} >
                  Comments
                  </Link>
                  </td>
                <td className="py-4 px-6 border-b text-center space-x-2">
                  <button
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition duration-200"
                  >
                    View
                  </button>

                  <button
                    onClick={() => navigate(`/event/edit/${event.id}`)}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-md transition duration-200"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(event.id)}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventList;
