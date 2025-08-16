// src/components/profile/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { API_USER, API_ENDPOINTS } from "../../features/base/config";
import Header from "../../components/dashboard/Header";
import PageLoader from "../../components/loading/PageLoader";
import ViewEventsList from "../../components/list/view/ViewEventsList";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = JSON.parse(localStorage.getItem("tokens"))?.access;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_USER.VIEW_USERS}${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.data);
      } catch (err) {
        setError("Failed to fetch user.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <PageLoader reason="Loading User Information" />;
  if (error)
    return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Header
        title="User Profile"
        subtitle={`Details of ${user.username}`}
        icon="bi bi-person"
        link="/userpanel"
      />

      <div className="bg-white shadow-lg rounded-xl mt-6 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex flex-col items-center">
          {user.profile_image ? (
            <img
              src={`${API_ENDPOINTS.MAIN_URL}${user.profile_image}`}
              alt="User Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold shadow-md">
              No Image
            </div>
          )}
          <h2 className="text-xl font-semibold mt-3">{user.username}</h2>
          <p className="text-sm text-indigo-200">{user.email}</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 text-sm">
          <div>
            <p className="font-medium">User ID</p>
            <p className="text-gray-600">{user.id}</p>
          </div>
          <div>
            <p className="font-medium">Role</p>
            <p className="text-gray-600">{user.role || "Not Assigned"}</p>
          </div>
          <div>
            <p className="font-medium">Superuser</p>
            <p className="text-gray-600">{user.is_superuser ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
      <ViewEventsList user_id={user.id} />
    </div>
  );
};

export default UserProfile;
