import React, { useContext, useEffect } from 'react';
import { EventContext } from '../../../context/EventContext';
import { API_ENDPOINTS } from '../../../features/base/config';
import { NavLink } from 'react-router-dom';
import TopHeader from '../../header/TopHeader';

const ViewEventsList = ({ user_id }) => {
    const { events, filteredEvents, setFilteredEvents } = useContext(EventContext);

    useEffect(() => {
        // Filter events for the specific user
        const userEvents = events.filter(event => event.organizer.id === user_id);
        setFilteredEvents(userEvents);

        console.log("User Events: ", userEvents);
        console.log("All Events: ", events);
    }, [events, user_id, setFilteredEvents]);

    // Slice the filteredEvents array to show only the first two events

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {filteredEvents.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">No Events Found</h2>
                        <p className="text-lg text-gray-600">This user has not created any events yet. Check back later!</p>
                    </div>
                </div>

            ) : 
            (
                <>
                {/* // This is the updated part for the grid */}
                    <TopHeader value={"User's Events List "} other={`Total events : ${filteredEvents.length}`}/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
                    {filteredEvents.map((event) => (
                        <NavLink
                            to={`/events/${event.id}`}
                            key={event.id}
                            className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden
                                ${event.is_blocked
                                    ? "border-4 border-red-500"
                                    : "border border-gray-200 hover:border-indigo-400"
                                }`}
                        >
                            {event.banner_image && (
                                <img
                                    src={API_ENDPOINTS.MAIN_URL + event.banner_image}
                                    alt={event.title}
                                    className="w-full h-48 object-cover rounded-t-xl"
                                />
                            )}

                            <div className="p-5">
                                <h2 className="text-2xl font-bold text-indigo-700 mb-2 truncate">
                                    {event.title}
                                </h2>

                                <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                                    {event.description}
                                </p>

                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>
                                        <span className="font-semibold text-gray-800">Category:</span>{' '}
                                        {event.category?.name || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-gray-800">Venue:</span>{' '}
                                        {event.venue?.city?.name || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-gray-800">Start:</span>{' '}
                                        {new Date(event.start_time).toLocaleString()}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-gray-800">End:</span>{' '}
                                        {new Date(event.end_time).toLocaleString()}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-gray-800">Visibility:</span>{' '}
                                        {event.is_public ? "Public" : "Private"}
                                    </p>
                                </div>

                                {event.is_blocked && (
                                    <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-lg font-medium">
                                        Blocked
                                    </div>
                                )}
                            </div>
                        </NavLink>
                    ))}
                </div>
                                </>

            )}
        </div>
    );
};

export default ViewEventsList;