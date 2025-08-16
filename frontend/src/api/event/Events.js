import { useEffect, useState } from "react";
import isTokenExpired from "../../auth/TokenManagement/isTokenExpired";
import refreshAccessToken from "../../auth/TokenManagement/refreshAccessToken";
import { Navigate, useNavigate } from "react-router-dom";
import { API_EVENT } from "../../features/base/config";
import axios from "axios";
import { getValidAccessToken } from "../../auth/AccessToken";
  const navigate = useNavigate();


export const fetchEvents = async ({setEvents,setLoading}) => {
      try {
              const access = await getValidAccessToken(navigate);

        
          const response = await axios.get(API_EVENT.GET_EVENTS, {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          });
          setEvents(response.data.data);
          console.log("Fetched events:", response.data.data);
        
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };