import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import App from './App';

// Init theme before render
const savedTheme = localStorage.getItem('pv_theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
