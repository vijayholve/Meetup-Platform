// src/components/QRCodeScanner.js
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';

const QRCodeScanner = () => {
    const [scanResult, setScanResult] = useState('');
    const [scanStatus, setScanStatus] = useState(null); // 'success', 'error', 'scanned'
    const [ticketInfo, setTicketInfo] = useState(null);
    const [cameraFacingMode, setCameraFacingMode] = useState('environment'); // 'user' for front camera, 'environment' for back

    const handleScan = async (result, error) => {
        if (result) {
            const scannedTicketId = result?.text;
            if (scannedTicketId && scannedTicketId !== scanResult) { // Prevent multiple scans of the same code quickly
                setScanResult(scannedTicketId);
                setScanStatus('scanning');
                setTicketInfo(null);
                
                try {
                    const response = await axios.post('/api/tickets/scan/', {
                        ticket_id: scannedTicketId
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}` // Staff authentication
                        }
                    });
                    setScanStatus('success');
                    setTicketInfo(response.data);
                } catch (err) {
                    setScanStatus('error');
                    if (err.response && err.response.data) {
                        setTicketInfo(err.response.data); // Display error details from backend
                    } else {
                        setTicketInfo({ detail: "Network error or unexpected response." });
                    }
                    console.error("Scanning error:", err);
                }
            }
        }

        if (error) {
            console.info(error);
            // You might want to handle specific errors like "NotAllowedError" for camera access
        }
    };

    const toggleCamera = () => {
        setCameraFacingMode(prevMode => (prevMode === 'environment' ? 'user' : 'environment'));
    };

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Ticket Scanner</h2>
            <p>Point the camera at the QR code.</p>

            <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
                    <QrReader
                        onResult={handleScan}
                        scanDelay={300} // Milliseconds delay between scans
                        constraints={{
                            facingMode: cameraFacingMode
                        }}
                        videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        containerStyle={{ width: '100%', height: '100%' }}
                        videoContainerStyle={{ width: '100%', height: '100%' }}
                    />
                </div>
            </div>

            <button onClick={toggleCamera} style={{ marginTop: '15px', padding: '10px 15px', cursor: 'pointer' }}>
                Switch Camera ({cameraFacingMode === 'environment' ? 'Front' : 'Back'})
            </button>

            <div style={{ marginTop: '20px' }}>
                {scanStatus === 'scanning' && <p>Scanning...</p>}
                {scanStatus === 'success' && ticketInfo && (
                    <div style={{ color: 'green', fontWeight: 'bold' }}>
                        <p>✅ Ticket Validated!</p>
                        <p>Event: {ticketInfo.event_title}</p>
                        <p>User: {ticketInfo.user_name}</p>
                        <p>Ticket Type: {ticketInfo.ticket_type}</p>
                        <p>Scanned At: {new Date(ticketInfo.scanned_at).toLocaleString()}</p>
                        <p>Ticket ID: {ticketInfo.ticket_id}</p>
                    </div>
                )}
                {scanStatus === 'error' && ticketInfo && (
                    <div style={{ color: 'red', fontWeight: 'bold' }}>
                        <p>❌ Scan Failed!</p>
                        <p>Reason: {ticketInfo.detail}</p>
                        {ticketInfo.status === 'scanned' && <p>This ticket was already scanned!</p>}
                        {ticketInfo.status === 'event_ended' && <p>This event has already ended!</p>}
                        <p>Scanned QR Data: {scanResult}</p>
                    </div>
                )}
                {scanResult && <p>Last Scanned: {scanResult}</p>}
            </div>
        </div>
    );
};

export default QRCodeScanner;