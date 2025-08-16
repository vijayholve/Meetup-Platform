import React, { useState } from "react";
import axios from "axios";
import { API_USER } from "../../features/base/config";
import { useNavigate } from "react-router-dom";

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    profile_image :""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState(null);

  const navigate = useNavigate();

  const ROLE_OPTIONS = [
    { value: "", label: "-- Select Role --" },
    { value: "organizer", label: "Organizer" },
    { value: "attendee", label: "Attendee" },
    { value: "vendor", label: "Vendor" },
  ];

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    setMessage("");

    const tokens = JSON.parse(localStorage.getItem("tokens"));
    const token = tokens?.access;

    try {
      const response = await axios.post(API_USER.VIEW_USERS, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      setMessage("✅ User created successfully!");
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "",
        profile_image:""
      });

      setTimeout(() => navigate("/userpanel"), 1500); // redirect after 1.5s
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors);
        setMessage(error.response.data.message || "Error occurred");
      } else {
        setMessage("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Create New User
      </h2>

      {message && (
        <div className="mb-4 text-center text-sm font-medium text-blue-600">
          {message}
        </div>
      )}

      {errors && (
        <div className="mb-4 text-sm text-red-500">
          <ul>
            {Object.entries(errors).map(([key, value]) => (
              <li key={key}>
                <strong>{key}</strong>: {value.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Profile image
          </label>
          <input
            type="file"
            name="profile_image"
            onChange={handleChange}
            className="mt-2 rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Role</label>
          <select
            name="role"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={formData.role}
            onChange={handleChange}
            required
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            name="is_superuser"
            checked={formData.is_superuser}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm text-gray-700">Make Super User</label>
        </div>
        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className={`px-5 py-2 rounded-md text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create User"}
          </button>

          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => navigate("/userpanel")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
