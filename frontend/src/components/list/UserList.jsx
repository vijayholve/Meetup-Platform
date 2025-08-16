import React, { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import Loading from "../loading/Loading";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, API_USER } from "../../features/base/config";
import isTokenExpired from "../../auth/TokenManagement/isTokenExpired";
import refreshAccessToken from "../../auth/TokenManagement/refreshAccessToken";
import axios from "axios";
import PageLoader from "../loading/PageLoader";
import { getValidAccessToken } from "../../auth/AccessToken";

const UserList = () => {
  const { users, loading ,setUsers } = useUserContext();
  useEffect(() => {
    console.log("Users in UserList:", users);
  }, [users]);
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const handleEdit = (userId) => {
    console.log("Edit:", userId);
    // Navigate to edit page or open a modal
  };

  const handleDelete = async (userId) => {
    console.log("Delete:", userId);
    try {
      setDeleteLoading(true);
      const access = await getValidAccessToken(navigate);
      const response = await axios.delete(`${API_USER.VIEW_USERS}${userId}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      setUsers(users.filter((e) => e.id !== userId))
      
      console.log("delete user:", response.data.data);
    } catch (error) {
      console.log("Error fetching users:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <Loading></Loading>;
  }
  if(deleteLoading){
    return <PageLoader reason={"User is deleting "}/>
  }
  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">User List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="py-3 px-4 border-b">id</th>

              <th className="py-3 px-4 border-b">Username</th>
                            <th className="py-3 px-4 border-b">Profile</th>

              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Role</th>
              <th className="py-3 px-4 border-b">User Type</th>

              <th className="py-3 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{user.id}</td>
                <td className="py-3 px-4 border-b font-medium">
                  {user.username}
                </td>
                <td className="py-3 px-4 border-b">
                  {user.profile_image ? (
                    <img
                      src={`${API_ENDPOINTS.MAIN_URL}${user.profile_image}`}
                      alt="profile_image"
                      className="w-16 h-10 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>

                <td className="py-3 px-4 border-b">{user.email || "-"}</td>
                <td className="py-3 px-4 border-b">
                  {user.role ? user.role : "none"}
                </td>

                <td className="py-3 px-4 border-b font-medium">
                  {user.is_superuser ? "Super User" : "Normal User"}
                </td>
                <td className="py-3 px-4 border-b text-center">
                  <button
                    onClick={() => navigate(`/user/edit/${user.id}`)}
                    className="text-blue-600 underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                  <Link className="" to={`/dashboard/user/${user.id}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
