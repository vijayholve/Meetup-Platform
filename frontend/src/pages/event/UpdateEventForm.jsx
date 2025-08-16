import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { API_EVENT } from "../../features/base/config";
import { useEventContext } from "../../context/EventContext";

const UpdateEventForm = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const {setEvents, categories = [], cities = [], venues = [] } = useEventContext();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    city_id: "",
    venue_id: "",
    start_time: "",
    end_time: "",
    is_public: true,
    banner_image: null,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [wantsToUpdateImage, setWantsToUpdateImage] = useState(false);
  const [wantsToUpdateDate, setWantsToUpdateDate] = useState(false);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const token = tokens?.access;

        const res = await axios.get(`${API_EVENT.GET_EVENTS}${eventId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = res.data.data;

        const matchedCity = venues.find((v) => v.id === data.venue)?.city;
        const cityObj = cities.find((c) => c.name === matchedCity);

        setFormData({
          title: data.title || "",
          description: data.description || "",
          category_id: data.category || "",
          venue_id: data.venue || "",
          city_id: cityObj ? cityObj.id.toString() : "",
          start_time: data.start_time || "",
          end_time: data.end_time || "",
          is_public: data.is_public ?? true,
          banner_image: null,
        });
      } catch (err) {
        setErrorMsg("❌ Failed to load event details.");
      }
    };

    fetchEvent();
  }, [eventId, cities, venues]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      setWantsToUpdateImage(true);
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const data = new FormData();

    for (const key in formData) {
      // Skip banner_image if not updating image
      if (key === "banner_image" && !wantsToUpdateImage) continue;

      // Skip date/time if not updating
      if ((key === "start_time" || key === "end_time") && !wantsToUpdateDate)
        continue;

      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    }

    try {
      const tokens = JSON.parse(localStorage.getItem("tokens"));
      const token = tokens?.access;

      const res = await axios.patch(
        `${API_EVENT.GET_EVENTS}${eventId}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        setSuccessMsg("✅ Event updated successfully.");
        const updatedEvent = res.data.data;
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          )
        );
        navigate("/eventpanel");
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error updating event:", error);

      if (error.response && error.response.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = [];

        for (const field in errors) {
          if (Array.isArray(errors[field])) {
            errorMessages.push(`${field}: ${errors[field][0]}`);
          }
        }

        // Show all error messages joined with line breaks or commas
        setErrorMsg("❌ " + errorMessages.join("\n"));
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = formData.city_id
    ? venues.filter(
        (v) =>
          v.city ===
          cities.find((c) => c.id.toString() === formData.city_id)?.name
      )
    : [];

  return (
    <div className="max-w-3xl mx-auto p-8 mt-8 bg-gradient-to-br from-white to-blue-50 shadow-lg rounded-2xl">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        ✏️ Update Event
      </h2>

      {successMsg && (
        <p className="text-green-600 text-center mb-4">{successMsg}</p>
      )}
      {errorMsg && <p className="text-red-600 text-center mb-4">{errorMsg}</p>}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category_id"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <select
            name="city_id"
            value={formData.city}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">-- Select City --</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Venue
          </label>
          <select
            name="venue_id"
            value={formData.venue}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">-- Select Venue --</option>
            {filteredVenues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={wantsToUpdateDate}
              onChange={() => setWantsToUpdateDate(!wantsToUpdateDate)}
            />
            Update Event Date & Time
          </label>
        </div>

        {wantsToUpdateDate && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" /> Start Time
              </label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </>
        )}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={wantsToUpdateImage}
              onChange={() => setWantsToUpdateImage(!wantsToUpdateImage)}
            />
            Update Event Image
          </label>
        </div>

        {wantsToUpdateImage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
              <PhotoIcon className="w-4 h-4" /> Change Banner
            </label>
            <input
              type="file"
              name="banner_image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 w-full"
            />
          </div>
        )}
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            name="is_public"
            checked={formData.is_public}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm text-gray-700">Make event public</label>
        </div>

        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md transition-all"
          >
            {loading ? "Updating..." : "Update Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEventForm;
