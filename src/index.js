import React from 'react';
// Init theme
const savedTheme = localStorage.getItem('pv_theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
import ReactDOM from 'react-dom/client';
import './i18n';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
