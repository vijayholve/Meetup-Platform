import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_EVENT } from "../../features/base/config";
import { useNavigate, useParams } from "react-router-dom";
import { getValidAccessToken } from "../../auth/AccessToken";

const UpdateCity = () => {
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState([]);
  const { id: cityId } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    const fetchCity = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const token = tokens?.access;

        const res = await axios.get(`${API_EVENT.CITY_VIEW}${cityId}/`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (res.status === 200) {
          setFormData({ name: res.data.data.name });
          console.log("name:", res.data);
          console.log(formData.name);
        } else {
          console.error("Failed to fetch city data");
        }
      } catch (error) {
        console.error("Error fetching city data:", error);
      }
    };
    fetchCity();
  }, [cityId]);
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form behavior
    setErrorMsg([]);
    setLoading(true);

    try {
            const token = await getValidAccessToken(navigate);
      
      const response = axios.patch(
        `${API_EVENT.CITY_VIEW}${cityId}/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("City updated:", response.data);
      navigate("/citypanel");
    } catch (error) {
      console.error("City update error", error);

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
        🏙️ Update New City
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City Name
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

        <button
          type="submit"
          className={`px-5 py-2 rounded-md text-white font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Update City"}
        </button>
      </form>
    </div>
  );
};

export default UpdateCity;
