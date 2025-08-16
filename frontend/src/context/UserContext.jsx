import React, { createContext, useEffect, useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import isTokenExpired from "../auth/TokenManagement/isTokenExpired";
import refreshAccessToken from "../auth/TokenManagement/refreshAccessToken";
import { API_ENDPOINTS, API_USER } from "../features/base/config";
import { getValidAccessToken } from "../auth/AccessToken";

// Create context
export const UserContext = createContext();

// Provider
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
    const [usersCount, setusersCount] = useState([]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
              const access = await getValidAccessToken(navigate);


        const response = await axios.get(API_USER.VIEW_USERS, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });


        setUsers(response.data.data);
        const response_count = await axios.get(API_ENDPOINTS.DASHBOARD_USER, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        setusersCount(response_count.data);
        console.log("Fetched users count:", response_count.data);
        console.log("Fetched users:", response.data.data);
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{usersCount,setusersCount, users, setUsers, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUserContext = () => useContext(UserContext);
