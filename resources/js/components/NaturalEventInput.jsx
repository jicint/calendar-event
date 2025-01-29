import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const NaturalEventInput = () => {
    const [eventText, setEventText] = useState('');
    const [status, setStatus] = useState('');

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setStatus('Creating event...');
                const response = await axios.post('/api/calendar/create-event-from-text', {
                    text: eventText,
                    token: tokenResponse.access_token,
                });
                
                if (response.data.status === 'success') {
                    setStatus('Event created successfully!');
                    setEventText('');
                    
                    // Show confirmation with parsed details
                    const parsed = response.data.parsed;
                    alert(`Event created for ${parsed.time} on ${parsed.date} at ${parsed.location}`);
                }
            } catch (error) {
                console.error('Error creating event:', error);
                setStatus('Error: ' + (error.response?.data?.message || error.message));
            }
        },
        scope: 'https://www.googleapis.com/auth/calendar.events',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (eventText.trim()) {
            setStatus('Creating event...');
            login();
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Create Calendar Event</h2>
            <p className="text-gray-600 mb-4">
                Enter your event details naturally, like:<br />
                "adrian has a meeting at 10 am tomorrow at grundschule"
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        value={eventText}
                        onChange={(e) => setEventText(e.target.value)}
                        placeholder="Type your event details..."
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                    disabled={!eventText.trim()}
                >
                    Create Event
                </button>
            </form>
            
            {status && (
                <div className={`mt-4 p-2 rounded ${
                    status.includes('success') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                    {status}
                </div>
            )}
        </div>
    );
};

export default NaturalEventInput; 