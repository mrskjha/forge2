import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Centralized API Base URL routing for production
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

if (API_BASE_URL) {
    const originalFetch = window.fetch;
    window.fetch = (input, init) => {
        if (typeof input === 'string' && input.startsWith('/api')) {
            return originalFetch(`${API_BASE_URL}${input}`, init);
        }
        return originalFetch(input, init);
    };
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
