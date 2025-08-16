// src/components/EventRegistrationForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import { API_EVENTREGISTER, API_EVENT } from '../../../features/base/config'; // Adjust path

const EventRegistrationForm = () => {
  const navigate = useNavigate();
  const { eventId: paramEventId } = useParams(); // Get eventId from URL parameters
  const [events, setEvents] = useState([]);
  const [selectedEventTicketTypes, setSelectedEventTicketTypes] = useState([]);
  const [formData, setFormData] = useState({
    event: paramEventId || '', // Pre-fill event if available from URL
    quantity: 1,
    ticket_type: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch all events for the dropdown, and potentially pre-select one
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem('tokens'));
        const token = tokens?.access;

        const res = await axios.get(API_EVENTREGISTER.VIEW_EVENTS, { // Use VIEW_EVENTS to get all events
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        if (res.status === 200) {
          setEvents(res.data);
          // If eventId is in the URL, and it's a valid event, select it
          if (paramEventId) {
            const preSelectedEvent = res.data.find(event => event.id === parseInt(paramEventId));
            if (preSelectedEvent) {
              setFormData(prev => ({ ...prev, event: parseInt(paramEventId) }));
            }
          }
        }
      } catch (error) {
        console.error('Failed to load events:', error);
        setErrorMsg('⚠️ Failed to fetch events');
      }
    };

    fetchEvents();
  }, [paramEventId]); // Depend on paramEventId to set the initial form state

  // Effect to load ticket types when an event is selected (either by user or pre-filled)
  useEffect(() => {
    const fetchTicketTypesForEvent = async () => {
      if (formData.event) {
        try {
          const tokens = JSON.parse(localStorage.getItem('tokens'));
          const token = tokens?.access;

          // Fetch event details including ticket types for the selected event
          const response = await axios.get(`${API_EVENT.GET_EVENTS}${formData.event}/`, { // Assuming GET_EVENTS provides ticket_types
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
            },
          });

          const eventDetails = response.data.data; // Adjust based on your API response structure

          if (eventDetails && eventDetails.ticket_types) {
            const activeTicketTypes = eventDetails.ticket_types.filter(type => type.quantity_available > 0);
            setSelectedEventTicketTypes(activeTicketTypes);
            // Automatically select the first available ticket type if available
            if (activeTicketTypes.length > 0) {
              setFormData(prev => ({ ...prev, ticket_type: activeTicketTypes[0].id }));
            } else {
              setFormData(prev => ({ ...prev, ticket_type: '' }));
            }
          } else {
            setSelectedEventTicketTypes([]);
            setFormData(prev => ({ ...prev, ticket_type: '' }));
          }
        } catch (error) {
          console.error('Failed to load ticket types:', error);
          setErrorMsg('⚠️ Failed to fetch ticket types for the selected event.');
          setSelectedEventTicketTypes([]);
          setFormData(prev => ({ ...prev, ticket_type: '' }));
        }
      } else {
        setSelectedEventTicketTypes([]);
        setFormData(prev => ({ ...prev, ticket_type: '' }));
      }
    };

    fetchTicketTypesForEvent();
  }, [formData.event]); // Re-run when formData.event changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Reset ticket type if event changes
    if (name === 'event') {
        setFormData(prev => ({ ...prev, ticket_type: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const dataToSend = {
      event: parseInt(formData.event),
      quantity: parseInt(formData.quantity),
      ticket_type: formData.ticket_type ? parseInt(formData.ticket_type) : null, // Send null if no ticket type selected
    };

    // Basic client-side validation
    if (!formData.event) {
        setErrorMsg('Please select an event.');
        setLoading(false);
        return;
    }
    if (selectedEventTicketTypes.length > 0 && !formData.ticket_type) {
        setErrorMsg('Please select a ticket type.');
        setLoading(false);
        return;
    }
    if (formData.quantity < 1) {
        setErrorMsg('Quantity must be at least 1.');
        setLoading(false);
        return;
    }

    try {
      const tokens = JSON.parse(localStorage.getItem('tokens'));
      const token = tokens?.access;

      const res = await axios.post(
        API_EVENTREGISTER.CREATE_REGISTRATION,
        dataToSend,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 201 || res.status === 200) {
        setSuccessMsg('🎉 Successfully registered for the event!');
        setFormData({ event: '', quantity: 1, ticket_type: '' }); // Reset form
        setTimeout(() => {
          navigate('/my-tickets'); // Navigate to the 'My Tickets' page after a short delay
        }, 1500);
      } else {
        throw new Error('Unexpected response');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response && error.response.data) {
          if (error.response.data.detail) {
              setErrorMsg(`❌ Registration failed: ${error.response.data.detail}`);
          } else if (error.response.data.non_field_errors) {
              setErrorMsg(`❌ Registration failed: ${error.response.data.non_field_errors.join(', ')}`);
          } else {
              // Try to display specific field errors if available
              const fieldErrors = Object.values(error.response.data).flat().join(', ');
              setErrorMsg(`❌ Registration failed: ${fieldErrors || 'Please check your input.'}`);
          }
      } else {
          setErrorMsg('❌ Registration failed. Network error or unexpected issue.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 mt-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">📝 Register for Event</h2>

      {successMsg && <p className="text-green-600 text-center mb-4">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 text-center mb-4">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="event" className="block text-sm font-medium text-gray-700">Select Event</label>
          <select
            id="event"
            name="event"
            value={formData.event}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={!!paramEventId} // Disable if pre-filled from URL
          >
            <option value="">-- Choose an Event --</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        {selectedEventTicketTypes.length > 0 && (
          <div>
            <label htmlFor="ticket_type" className="block text-sm font-medium text-gray-700">Select Ticket Type</label>
            <select
              id="ticket_type"
              name="ticket_type"
              value={formData.ticket_type}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select Ticket Type --</option>
              {selectedEventTicketTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} (₹{parseFloat(type.price).toFixed(2)}) - Available: {type.quantity_available}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* If no ticket types are available for the selected event, or if event has no ticket types defined */}
        {formData.event && selectedEventTicketTypes.length === 0 && (
          <p className="text-orange-600 text-sm">No tickets available for this event or no specific ticket types defined. You might only be able to register once without quantity/type options.</p>
        )}


        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md transition-all"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventRegistrationForm;