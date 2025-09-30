import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useEventContext } from "../../context/EventContext";
import Loading from "../loading/Loading";
import NoEventsFound from "../notFound/NotEventFound";
import { API_ENDPOINTS } from "../../features/base/config"; // Ensure this is imported

const formatDateBadge = (isoString) => {
  if (!isoString) return { day: "", month: "" };
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  return { day, month };
};

const CompactCards = () => {
  // Renamed component for clarity
  const { filteredEvents, loading } = useEventContext();
  const [eventStates, setEventStates] = useState({});
    useEffect(() => {
        // Initialize eventStates when filteredEvents changes
        const initialStates = {};
        filteredEvents.forEach(event => {
          initialStates[event.id] = {
            is_liked: event.is_liked,
            total_likes_count: event.total_likes_count,
          };
        });
        setEventStates(initialStates);
      }, [filteredEvents]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-8">Trending Events</h1>{" "} */}
      {/* Changed heading */}
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 && (
            <div className="col-span-full text-center">
              <NoEventsFound />
            </div>
          )}

          {filteredEvents.map((event) => {
            const { day, month } = formatDateBadge(event.start_time);
            return (
              <div
                key={event.id}
                className={`
                  relative
                  bg-white
                  rounded-2xl
                  shadow-xl
                  hover:shadow-2xl
                  transform
                  hover:-translate-y-1
                  transition-all
                  duration-300
                  overflow-hidden
                  flex
                  flex-col
                  ${event.is_blocked ? "border-2 border-red-500" : ""}
                `}
              >
                {/* Top Image Area */}
                <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
                  <img
                    src={
                      event.banner_image
                        ? API_ENDPOINTS.MAIN_URL + event.banner_image
                        : ""
                    }
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Heart and Bookmark Icons */}
                  {/* <div className="absolute top-3 right-3 flex space-x-2 z-10">
                    <button className="bg-white/70 backdrop-blur-sm p-2 rounded-full text-gray-700 hover:text-red-500 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="bg-white/70 backdrop-blur-sm p-2 rounded-full text-gray-700 hover:text-indigo-500 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </button>
                  </div> */}
                  {/* Date Badge (positioned for visual similarity) */}
                  {event.start_time && (
                    <div className="absolute bottom-3 left-3 bg-white text-gray-800 p-2 rounded-lg text-center shadow-md">
                      <div className="text-xl font-bold leading-none">
                        {day}
                      </div>
                      <div className="text-xs uppercase">{month}</div>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Event Title */}
                  <NavLink
                    to={`/events/${event.id}`}
                    className="text-xl font-bold text-gray-800 mb-2 truncate
                    hover:text-indigo-600 transition-colors 
                    


                    
                    "
                  >
                    {event.title}
                  </NavLink>

                  {/* Organizer/Creator Info */}
                  <div className="flex items-center mb-3">
                    <img
                      src={
                        event.organizer?.profile_image
                          ? API_ENDPOINTS.MAIN_URL +
                            event.organizer.profile_image
                          : ""
                      }
                      alt={event.organizer?.username || "Organizer"}
                      className="w-8 h-8 rounded-full object-cover mr-3 border border-gray-200"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {event.organizer?.username || "Unknown Organizer"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Event Organizer {/* Default role */}
                      </p>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {" "}
                    {/* line-clamp for truncation */}
                    {event.description ||
                      "No description available for this event."}
                  </p>

                  {/* Engagement Metrics */}
                  <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-4 mt-auto">
                    {/* Fake "Plays" / "Views" (adapted for events) */}
                    <p className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {event.total_attendee > 0
                        ? event.total_attendee.toLocaleString()
                        : "0"}{" "}
                      {/* Fake a larger number */}
                    </p>
                    {/* "Comments" / "Interactions" */}
                    <p className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-pink-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      {event.total_ratings_count > 0
                        ? event.total_ratings_count.toLocaleString()
                        : "0"}{" "}
                      {/* Using actual rating count, then fake */}
                    </p>
                    {/* "Saves" / "Bookmarks" - using average rating for this as it's a "saved" metric */}
                    <p className="flex items-center">
                      <span className="text-yellow-500 mr-1 text-base">⭐</span>
                      <span className="font-medium text-gray-700">
                        {event.average_rating
                          ? event.average_rating.toFixed(1)
                          : "0.0"}
                      </span>
                      <span className="ml-0.5">/ 5</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompactCards;
