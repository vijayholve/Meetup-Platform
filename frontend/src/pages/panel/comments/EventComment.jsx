import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getValidAccessToken } from '../../../auth/AccessToken';
import axios from 'axios';
import { API_EVENT } from '../../../features/base/config';
import EventCommentsList from '../../../components/list/comments/EventCommentsList';

const EventCommentPanel = () => {
    const { id: eventId } = useParams();
    const [event, setEvent] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError(null);
                const access = await getValidAccessToken(navigate);

                const response = await axios.get(`${API_EVENT.GET_EVENTS}${eventId}/`, {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                });

                console.log("Fetched event details raw response:", response.data); 
                
                // --- FIX APPLIED HERE ---
                // Set event to response.data.data as confirmed by your API log
                if (response.data && response.data.data) {
                    setEvent(response.data.data);
                } else {
                    setError("Unexpected data structure for event details.");
                    setEvent(null);
                }
                
            } catch (error) {
                console.error("Error fetching event details:", error);
                const errorMessage = error.response?.data?.message || "Failed to load event details. Please try again.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        } else {
            setLoading(false);
            setError("Event ID is missing in URL.");
        }
    }, [eventId, navigate]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Event Comments</h2>

            {loading ? (
                <div>Loading event details...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : event ? (
                <div className="mb-4 p-4 border rounded-md shadow-sm bg-white">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-gray-700 mb-2">{event.description}</p>
                    {/* Access username from organizer object. Add defensive check. */}
                    <p className="text-gray-500 text-sm">
                        Organizer: {event.organizer ? event.organizer.username : 'N/A'}
                    </p>
                </div>
            ) : (
                <div className="text-gray-600">No event found for this ID.</div>
            )}

            {/* Render comments list only if eventId is available and event details loaded successfully */}
            {eventId && event && !error && <EventCommentsList event_id={eventId} />}
        </div>
    );
};

export default EventCommentPanel;