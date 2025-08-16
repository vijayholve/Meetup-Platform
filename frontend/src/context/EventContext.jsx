import React, { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { API_ENDPOINTS, API_EVENT } from "../features/base/config";
import { getValidAccessToken } from "../auth/AccessToken";

// Create context
export const EventContext = createContext();

// Provider
export const EventProvider = ({ children }) => {
  const [eventsCount, seteventsCount] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [venues, setVenues] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const access = await getValidAccessToken(navigate);

        const [eventRes, countRes, modelInfoRes] = await Promise.all([
          axios.get(API_EVENT.GET_EVENTS, {
            headers: { Authorization: `Bearer ${access}` },
          }),
          axios.get(API_ENDPOINTS.DASHBOARD_EVENT, {
            headers: { Authorization: `Bearer ${access}` },
          }),
          axios.get(API_EVENT.MODEL_INFO, {
            headers: { Authorization: `Bearer ${access}` },
          }),
        ]);

        setEvents(eventRes.data.data);
        seteventsCount(countRes.data);
        setCategories(modelInfoRes.data.data.categories);
        setCities(modelInfoRes.data.data.cities);
        setVenues(modelInfoRes.data.data.venues);

        console.log("Fetched model info:", modelInfoRes.data);
        console.log("Fetched events count:", countRes.data);
        console.log("Fetched events:", eventRes.data.data);
      } catch (error) {
        console.log("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [localStorage.getItem("tokens")]); // Watch token change

  return (
    <EventContext.Provider
      value={{
        filteredEvents,
        setFilteredEvents,
        eventsCount,
        seteventsCount,
        events,
        setEvents,
        loading,
        setLoading,
        categories,
        setCategories,
        cities,
        setCities,
        venues,
        setVenues,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

// Custom hook
export const useEventContext = () => useContext(EventContext);
