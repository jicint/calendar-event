import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NaturalEventInput from './components/NaturalEventInput';

const App = () => {
    return (
        <GoogleOAuthProvider clientId="461123765409-u9o4jjshsgv5ars5n2bgitg2a407gj3k.apps.googleusercontent.com">
            <NaturalEventInput />
        </GoogleOAuthProvider>
    );
};

const root = createRoot(document.getElementById('app'));
root.render(<App />); 