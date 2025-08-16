// src/pages/MyTicketsPage.js (or wherever you locate your pages)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_EVENTREGISTER } from '../../features/base/config';
import TicketQRCodeDisplay from './TicketQRCodeDisplay';

const MyTicketsPage = () => {
    const [userRegistrations, setUserRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserRegistrations = async () => {
            try {
                const tokens = JSON.parse(localStorage.getItem('tokens'));
                const token = tokens?.access;

                if (!token) {
                    setError("You need to be logged in to view your tickets.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(API_EVENTREGISTER.MY_REGISTRATIONS, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserRegistrations(response.data);
            } catch (err) {
                console.error("Error fetching user registrations:", err);
                setError("Failed to load your tickets. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserRegistrations();
    }, []);

    if (loading) return <p>Loading your tickets...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (userRegistrations.length === 0) return <p>You haven't registered for any events yet.</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>My Booked Tickets</h2>
            {userRegistrations.map(registration => (
                <div key={registration.id} style={{ marginBottom: '40px', border: '1px solid #eee', padding: '20px', borderRadius: '8px' }}>
                    <h3>Event: {registration.event_details.title}</h3>
                    <p>Registered at: {new Date(registration.registered_at).toLocaleString()}</p>
                    <p>Total Tickets: {registration.quantity}</p>
                    {registration.ticket_type_details && (
                        <p>Ticket Type: {registration.ticket_type_details.name} (₹{registration.ticket_type_details.price})</p>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                        {registration.individual_tickets.map(individualTicket => (
                            <TicketQRCodeDisplay
                                key={individualTicket.unique_id}
                                individualTicketId={individualTicket.unique_id}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyTicketsPage;