import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_EVENTREGISTER } from '../../features/base/config'; 
const TicketQRCodeDisplay = ({ individualTicketId }) => {
    const [qrCodeData, setQrCodeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchQRCode = async () => {
            setLoading(true);
            setError(null);
            try {
                const tokens = JSON.parse(localStorage.getItem('tokens'));
                const token = tokens?.access;

                if (!token) {
                    setError("Authentication token missing for QR code.");
                    setLoading(false);
                    return;
                }
                
               const response = await axios.get(`${API_EVENTREGISTER.GENERATE_QR_CODE}${individualTicketId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setQrCodeData(response.data); // This should contain { qr_code_image: "data:image/png;base64,...", ... }
                } else {
                    setError("Failed to fetch QR code: " + (response.data.detail || "Unknown error"));
                }
            } catch (err) {
                console.error(`Error fetching QR code for ID ${individualTicketId}:`, err);
                if (err.response && err.response.data && err.response.data.detail) {
                    setError(`Failed to load QR code: ${err.response.data.detail}`);
                } else {
                    setError("Failed to load QR code. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (individualTicketId) { // Only fetch if individualTicketId is available
            fetchQRCode();
        }
    }, [individualTicketId]); // Re-run effect if individualTicketId changes

    if (loading) return <p>Loading QR code...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!qrCodeData || !qrCodeData.qr_code_image) return <p>No QR code data available.</p>;

    return (
        <div style={{ textAlign: 'center', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
            <p style={{ fontWeight: 'bold' }}>Ticket ID: {qrCodeData.ticket_id.substring(0, 8)}...</p> {/* Display truncated UUID */}
            <img 
                src={qrCodeData.qr_code_image} 
                alt={`QR Code for ${qrCodeData.ticket_id}`} 
                style={{ width: '150px', height: '150px', margin: '10px auto', display: 'block' }} 
            />
            {/* You can display more details here if needed */}
            <p>{qrCodeData.event_title}</p>
            <p>Holder: {qrCodeData.user_name}</p>
            {qrCodeData.ticket_type_name && <p>Type: {qrCodeData.ticket_type_name}</p>}
        </div>
    );
};

export default TicketQRCodeDisplay;