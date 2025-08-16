import React from "react";
import Loading from "../loading/Loading";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, API_EVENTREGISTER } from "../../features/base/config";
import { useEventregisterContext } from "../../context/EventregisterContext";
import axios from "axios";
import PageLoader from "../loading/PageLoader";
import { getValidAccessToken } from "../../auth/AccessToken";

const EventregisterList = () => {
  const { eventregisters, setEventregisters, loading, setLoading } = useEventregisterContext();
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const handleDelete = async (eventregisterId) => {
    try {
      setDeleteLoading(true);
            const access = await getValidAccessToken(navigate);


      await axios.delete(`${API_EVENTREGISTER.VIEW_EVENTREGISTERS}${eventregisterId}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      setDeleteLoading(false);
      // Filter out the deleted item from the local state
      setEventregisters(eventregisters.filter((e) => e.id !== eventregisterId));
      console.log("Deleted successfully.");
    } catch (error) {
      console.error("Error deleting eventregister:", error);
      setDeleteLoading(false);
    }
  };

  if (loading ) {
    return <Loading />;
  }
  if (deleteLoading) {
    return <PageLoader reason={"Deleting register event"} />;
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Event Register List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="py-3 px-4 border-b">ID</th>
              <th className="py-3 px-4 border-b">Title</th>
              <th className="py-3 px-4 border-b">User</th>
              <th className="py-3 px-4 border-b">Category</th>
              <th className="py-3 px-4 border-b">Venue</th>
              <th className="py-3 px-4 border-b">Start</th>
              <th className="py-3 px-4 border-b">End</th>
              <th className="py-3 px-4 border-b">Public</th>
              <th className="py-3 px-4 border-b">Banner</th>
              <th className="py-3 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {eventregisters.map((eventregister) => (
              <tr key={eventregister.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{eventregister.id}</td>
                <td className="py-3 px-4 border-b font-medium">
                  {eventregister.event_detail.title}
                </td>
                <td className="py-3 px-4 border-b font-medium">
                  {eventregister.user?.name}
                </td>
                <td className="py-3 px-4 border-b">
                  {eventregister.event_detail.category?.name || "-"}
                </td>
                <td className="py-3 px-4 border-b">{eventregister.event_detail.venue?.name}</td>
                <td className="py-3 px-4 border-b">
                  {new Date(eventregister.event_detail.start_time).toLocaleString()}
                </td>
                <td className="py-3 px-4 border-b">
                  {new Date(eventregister.event_detail.end_time).toLocaleString()}
                </td>
                <td className="py-3 px-4 border-b">
                  {eventregister.event_detail.is_public ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-red-600">No</span>
                  )}
                </td>
                <td className="py-3 px-4 border-b">
                  {eventregister.event_detail.banner_image ? (
                    <img
                      src={`${API_ENDPOINTS.MAIN_URL}${eventregister.event_detail.banner_image}`}
                      alt="Banner"
                      className="w-16 h-10 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
                <td className="py-3 px-4 border-b text-center">
                  {/* <button
                    onClick={() => navigate(`/eventregister/edit/${eventregister.id}`)}
                    className="text-blue-600 underline mr-3"
                  >
                    Edit
                  </button> */}
                  <button
                    onClick={() => handleDelete(eventregister.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
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

export default EventregisterList;
