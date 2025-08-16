import axios from "axios";
import React, { useState } from "react";
import { API_EVENT } from "../../features/base/config";
import { useNavigate } from "react-router-dom";
import { useEventContext } from "../../context/EventContext";
import { getValidAccessToken } from "../../auth/AccessToken";

const CreateVenue = () => {
  const { cities, setVenues } = useEventContext();
  const [formData, setFormData] = useState({ name: "", city_id: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form behavior
    setErrorMsg([]);
    setLoading(true);

    try {
      const access = await getValidAccessToken(navigate);

      const response = await axios.post(API_EVENT.VENUE_VIEW, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: access ? `Bearer ${access}` : "",
        },
      });
      const newvenue = response.data.data;
      setVenues((prevvenues) => [newvenue, ...prevvenues]);

      console.log("Venue created:", response.data);
      navigate("/venuepanel");
    } catch (error) {
      console.error("Venue create error", error);

      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        const extractedErrors = [];

        for (let key in errors) {
          errors[key].forEach((msg) => extractedErrors.push(`${key}: ${msg}`));
        }

        setErrorMsg(extractedErrors);
      } else {
        setErrorMsg([error.message || "Something went wrong"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-8 bg-gradient-to-br from-white to-blue-50 shadow-lg rounded-2xl">
      {errorMsg.length > 0 && (
        <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded">
          <ul className="list-disc pl-5">
            {errorMsg.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        🏙️ Create New Venue
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Venue Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <select
            name="city_id"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">-- Select City --</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className={`px-5 py-2 rounded-md text-white font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Venue"}
        </button>
      </form>
    </div>
  );
};

export default CreateVenue;
