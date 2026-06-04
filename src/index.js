import React from 'react';
import './index.css';
import App from './App';

const root = document.getElementById('root');
root.innerHTML = '<div id="app"></div>';

const appContainer = document.getElementById('app');
appContainer.innerHTML = '<div id="root"></div>';

import { createRoot } from 'react-dom/client';
const rootElement = createRoot(document.getElementById('root'));
rootElement.render(<App />);
