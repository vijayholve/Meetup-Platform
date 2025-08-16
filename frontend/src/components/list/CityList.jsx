import React from "react";
import { useEventContext } from "../../context/EventContext";
import Loading from "../loading/Loading";
import { Navigate, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, API_EVENT } from "../../features/base/config";
import axios from "axios";
import PageLoader from "../loading/PageLoader";
import { getValidAccessToken } from "../../auth/AccessToken";

const CityList = () => {
  const { cities, loading, setCities } = useEventContext();
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  
  const handleDelete = async (cityId) => {
    try {
      setDeleteLoading(true);
            const access = await getValidAccessToken(navigate);


      await axios.delete(`${API_EVENT.CITY_VIEW}${cityId}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }).then((res) => {
            console.log("City deleted successfully",res.data);
        })
        .catch(err => {
            console.error("Error deleting city:", err);
        });
      // Filter out the deleted item from the local state
      setCities(cities.filter((e) => e.id !== cityId));
      setDeleteLoading(false);
      console.log("Deleted successfully.");
    } catch (error) {
      console.error("Error deleting city:", error);
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <Loading></Loading>;
  }
  if (deleteLoading) {
    return <PageLoader reason={"Deleting City"} />;
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">City List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="py-3 px-4 border-b">id</th>
              <th className="py-3 px-4 border-b">name</th>
              <th className="py-3 px-4 border-b">action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {cities.map((city) => (
              <tr key={city.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{city.id}</td>
                <td className="py-3 px-4 border-b font-medium">{city.name}</td>

                <td className="py-3 px-4 border-b text-center">
                  <button
                    onClick={() => navigate(`/city/edit/${city.id}`)}
                    className="text-blue-600 underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(city.id)}
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

export default CityList;
