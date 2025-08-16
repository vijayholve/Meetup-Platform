import React, { createContext, useEffect, useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import isTokenExpired from "../auth/TokenManagement/isTokenExpired";
import refreshAccessToken from "../auth/TokenManagement/refreshAccessToken";
import { API_EVENTREGISTER } from "../features/base/config";
import { getValidAccessToken } from "../auth/AccessToken";

// Create context
export const EventregisterContext = createContext();

// Provider
export const EventregisterProvider = ({ children }) => {
  const [eventregisters, setEventregisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventregisters = async () => {
      try {

        const access = await getValidAccessToken(navigate);


        const response = await axios.get(API_EVENTREGISTER.VIEW_EVENTREGISTERS, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        setEventregisters(response.data.data);
        console.log("Fetched eventregisters:", response.data.data);
      } catch (error) {
        console.log("Error fetching eventregisters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventregisters();
  }, []);

  return (
    <EventregisterContext.Provider value={{ eventregisters, setEventregisters, loading, setLoading }}>
      {children}
    </EventregisterContext.Provider>
  );
};

// Custom hook
export const useEventregisterContext = () => useContext(EventregisterContext);
