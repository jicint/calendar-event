import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const CalendarEventForm = () => {
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
    });

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await axios.post('/api/calendar/create-event', {
                    ...eventData,
                    token: tokenResponse.access_token,
                });
                
                if (response.data.status === 'success') {
                    alert('Event created successfully!');
                }
            } catch (error) {
                console.error('Error creating event:', error);
                alert('Failed to create event');
            }
        },
        scope: 'https://www.googleapis.com/auth/calendar.events',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        login(); // This will trigger the Google OAuth flow
    };

    const handleChange = (e) => {
        setEventData({
            ...eventData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
            <div className="mb-4">
                <label className="block mb-2">Event Title</label>
                <input
                    type="text"
                    name="title"
                    value={eventData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2">Description</label>
                <textarea
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2">Start Time</label>
                <input
                    type="datetime-local"
                    name="start_time"
                    value={eventData.start_time}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2">End Time</label>
                <input
                    type="datetime-local"
                    name="end_time"
                    value={eventData.end_time}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Create Event
            </button>
        </form>
    );
};

export default CalendarEventForm; 