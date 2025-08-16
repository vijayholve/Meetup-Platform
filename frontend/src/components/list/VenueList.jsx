import React from "react";
import { useEventContext } from "../../context/EventContext";
import Loading from "../loading/Loading";
import { Navigate, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, API_EVENT } from "../../features/base/config";
import axios from "axios";
import PageLoader from "../loading/PageLoader";
import { getValidAccessToken } from "../../auth/AccessToken";

const VenueList = () => {
  const { venues, loading, setVenues } = useEventContext();
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const handleDelete = async (venueId) => {
    try {
      setDeleteLoading(true);
      const access = await getValidAccessToken(navigate);
      await axios
        .delete(`${API_EVENT.VENUE_VIEW}${venueId}/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        })
        .then((res) => {
          console.log("Venue deleted successfully");
        })
        .catch((err) => {
          console.error("Error deleting venue:", err);
        });
      // Filter out the deleted item from the local state
      setVenues(venues.filter((e) => e.id !== venueId));
      setDeleteLoading(false);
      console.log("Deleted successfully.");
    } catch (error) {
      console.error("Error deleting venue:", error);
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <Loading></Loading>;
  }
  if (deleteLoading) {
    return <PageLoader reason={"Deleting Venue"} />;
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Venue List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="py-3 px-4 border-b">id</th>
              <th className="py-3 px-4 border-b">name</th>
                            <th className="py-3 px-4 border-b">city</th>
              <th className="py-3 px-4 border-b">action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {venues.map((venue) => (
              <tr key={venue.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{venue.id}</td>
                <td className="py-3 px-4 border-b font-medium">{venue.name}</td>
                <td className="py-3 px-4 border-b font-medium">{venue.city}</td>

                <td className="py-3 px-4 border-b text-center">
                  <button
                    onClick={() => navigate(`/venue/edit/${venue.id}`)}
                    className="text-blue-600 underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(venue.id)}
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

export default VenueList;
