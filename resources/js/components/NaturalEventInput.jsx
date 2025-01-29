import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const NaturalEventInput = () => {
    const [eventText, setEventText] = useState('');
    const [status, setStatus] = useState('');
    const [conflicts, setConflicts] = useState([]);
    const [isListening, setIsListening] = useState(false);

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (recognition) {
        recognition.continuous = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setEventText(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            setStatus('Error: Could not recognize speech');
        };
    }

    const startListening = () => {
        if (recognition) {
            setStatus('Listening...');
            setIsListening(true);
            recognition.start();
        } else {
            setStatus('Speech recognition not supported in this browser');
        }
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
    };

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setStatus('Checking schedule...');
                const response = await axios.post('/api/calendar/create-event-from-text', {
                    text: eventText,
                    token: tokenResponse.access_token,
                });
                
                if (response.data.status === 'warning') {
                    setConflicts(response.data.conflicts);
                    setStatus('Warning: Schedule Conflicts Found!');
                } else if (response.data.status === 'success') {
                    setStatus('Event created successfully!');
                    setEventText('');
                    setConflicts([]);
                    
                    // Show confirmation with parsed details
                    const parsed = response.data.parsed;
                    alert(`Event created for ${parsed.time} on ${parsed.date} at ${parsed.location}`);
                }
            } catch (error) {
                console.error('Error:', error);
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
                Speak or type your event details, like:<br />
                "adrian has a meeting at 10 am tomorrow at grundschule"
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={eventText}
                        onChange={(e) => setEventText(e.target.value)}
                        placeholder="Type or speak your event details..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="button"
                        onClick={isListening ? stopListening : startListening}
                        className={`px-4 py-2 rounded-lg ${
                            isListening 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-green-500 hover:bg-green-600'
                        } text-white`}
                    >
                        {isListening ? '⏹️ Stop' : '🎤 Speak'}
                    </button>
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
                    status.includes('Listening') ? 'bg-green-100 text-green-700' :
                    status.includes('success') ? 'bg-green-100 text-green-700' : 
                    'bg-blue-100 text-blue-700'
                }`}>
                    {status}
                </div>
            )}
            
            {conflicts.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                    <h3 className="text-yellow-700 font-bold">Schedule Conflicts:</h3>
                    <ul className="mt-2">
                        {conflicts.map((conflict, index) => (
                            <li key={index} className="text-yellow-600">
                                "{conflict.summary}" from {new Date(conflict.start).toLocaleTimeString()} 
                                to {new Date(conflict.end).toLocaleTimeString()}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={handleSubmit}
                        className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                        Schedule Anyway
                    </button>
                </div>
            )}
        </div>
    );
};

export default NaturalEventInput; 