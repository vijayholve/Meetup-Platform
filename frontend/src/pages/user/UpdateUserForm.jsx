import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_USER } from "../../features/base/config";

const UpdateUserForm = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

const [formData, setFormData] = useState({
  username: "",
  email: "",
  is_superuser: false,
  profile_picture: null,
});


  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [wantsToUpdatePicture, setWantsToUpdatePicture] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const token = tokens?.access;

        const response = await axios.get(`${API_USER.VIEW_USERS}${userId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const user = response.data.data;

        setFormData({
          username: user.username || "",
          last_name: user.last_name || "",
          email: user.email || "",
          phone: user.phone || "",
          is_active: user.is_active ?? true,
          profile_image: null,
        });
      } catch (error) {
        console.error(error);
        setErrorMessage("❌ Failed to fetch user details.");
      }
    };

    fetchUserDetails();
  }, [userId]);

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
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const tokens = JSON.parse(localStorage.getItem("tokens"));
      const token = tokens?.access;

      const data = new FormData();
      for (const key in formData) {
        if (key === "profile_image" && !wantsToUpdatePicture) continue;
        if (
          formData[key] !== null &&
          formData[key] !== undefined &&
          formData[key] !== ""
        ) {
          data.append(key, formData[key]);
        }
      }

      const response = await axios.patch(
        `${API_USER.VIEW_USERS}${userId}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (response.status === 200 || response.status === 202) {
        setSuccessMessage("✅ User updated successfully!");
        setTimeout(() => navigate("/userpanel"), 1500);
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("❌ Failed to update user. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-8 bg-white shadow-lg rounded-2xl">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        ✏️ Update User Info
      </h2>

      {successMessage && (
        <p className="text-green-600 text-center mb-4">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-600 text-center mb-4">{errorMessage}</p>
      )}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

       <div className="md:col-span-2 mt-4">
  <label className="inline-flex items-center">
    <input
      type="checkbox"
      checked={formData.is_superuser}
      onChange={handleChange}
      name="is_superuser"
      className="mr-2"
    />
    Superuser
  </label>
</div>


        <div className="md:col-span-2 mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={wantsToUpdatePicture}
              onChange={() => setWantsToUpdatePicture((prev) => !prev)}
              className="mr-2"
            />
            Update Profile Picture
          </label>
          {wantsToUpdatePicture && (
            <input
              type="file"
              name="profile_image"
              onChange={handleChange}
              className="mt-2 rounded-md border-gray-300 shadow-sm"
              required
            />
          )}
        </div>

        <div className="md:col-span-2 text-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md transition-all disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserForm;
