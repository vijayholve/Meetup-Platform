import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  API_ENDPOINTS,
  API_EVENT,
  API_EVENTREGISTER,
} from "../../features/base/config";
import PageLoader from "../../components/loading/PageLoader";
import RatingStar from "../../components/rating/Rate";
import CommentsSection from "../../components/comment/Comments";
import { getValidAccessToken } from "../../auth/AccessToken";

const EventDetail = () => {
  const { id: eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [msg, setMsg] = useState(""); // No longer needed for direct registration confirmation here
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const access = await getValidAccessToken(navigate);

        const response = await axios.get(`${API_EVENT.GET_EVENTS}${eventId}/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        // Assuming your event detail API includes ticket types for that event
        // If not, you might need a separate call here or adjust your Django EventSerializer
        setEvent(response.data.data);
      } catch (error) {
        console.error("Error fetching event:", error);
        // You might want to set an error state here to display to the user
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate]); // Add navigate to dependency array

  // --- MODIFIED handleRegister function ---
  const handleRegister = () => {
    // Navigate to the EventRegistrationForm, passing eventId as state
    // This allows the registration form to pre-select the event.
    navigate(`/register-event/${eventId}`);
  };

  if (loading && !event) {
    return <PageLoader reason="Event Detail" />;
  }

  // Handle case where event is null after loading (e.g., event not found)
  if (!event) {
      return <div className="text-center text-red-500 mt-10">Event not found or an error occurred.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Banner */}
      {event.banner_image && (
        <section className="relative h-[400px] w-full overflow-hidden">
          <img
            src={`${API_ENDPOINTS.MAIN_URL}${event.banner_image}`}
            alt="Event Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl sm:text-6xl font-bold mb-2 drop-shadow-xl">
                {event.title}
              </h1>
              <p className="text-lg sm:text-xl">
                Discover more about this event
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Main Content + Sidebar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left/Main Section */}
        <section className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <article className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              About this event
            </h2>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-gray-600 mt-8">
              <div>
                <span className="font-medium">Category:</span>
                <p>{event.category?.name || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium">Venue:</span>
                <p>{event.venue?.name || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium">City:</span>
                <p>{event.city?.name || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium">Start Time:</span>
                <p>{new Date(event.start_time).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium">End Time:</span>
                <p>{new Date(event.end_time).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium">Public:</span>
                <p>{event.is_public ? "Yes" : "No"}</p>
              </div>
            </div>
          </article>

          {/* Display Ticket Types and Prices */}
          {event.ticket_types && event.ticket_types.length > 0 && (
            <article className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Available Tickets
              </h2>
              <div className="space-y-4">
                {event.ticket_types.map(ticketType => (
                  <div key={ticketType.id} className="border-b pb-2 last:border-b-0">
                    <h3 className="font-bold text-lg">{ticketType.name}</h3>
                    <p className="text-gray-700">Price: ₹{parseFloat(ticketType.price).toFixed(2)}</p>
                    <p className="text-gray-600 text-sm">Available: {ticketType.quantity_available === 0 ? 'Sold Out' : ticketType.quantity_available}</p>
                    {ticketType.description && <p className="text-gray-500 text-sm italic">{ticketType.description}</p>}
                  </div>
                ))}
              </div>
            </article>
          )}

        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Organizer Info */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Organized by
            </h3>
            <p className="text-gray-700">
              {event.organizer?.username || "Unknown"}
            </p>
          </section>

          {/* Event Status */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Event Status
            </h3>
            <p
              className={`text-sm font-medium ${
                event.is_blocked ? "text-red-600" : "text-green-600"
              }`}
            >
              {event.is_blocked ? "❌ Blocked" : "✅ Active"}
            </p>
          </section>

          {/* Register Button */}
          <div className="text-center">
            <a

              // onClick={handleRegister} // Now navigates to the registration form
              disabled={loading || event.is_blocked} // Disable if loading or event is blocked
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-disabled={loading || event.is_blocked}
              href={`/register-event/${eventId}`} // Direct link to registration form
            >
              Register Now (Choose Tickets)
            </a>
            {/* {msg && <p className="mt-2 text-sm text-gray-600">{msg}</p>} */}
          </div>
        </aside>
      </main>

      <section className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-12">
        {/* <CommentsSection eventId={eventId} /> */}
        <RatingStar eventId={eventId} />
      </section>
      {/* Comments & Ratings - Full Width Below */}
    </div>
  );
};

export default EventDetail;