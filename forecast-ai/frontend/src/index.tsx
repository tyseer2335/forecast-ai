import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * This code initializes and renders the main React application.
 * 
 * It imports required dependencies, styles, and performance measuring tools, 
 * then sets up the root of the React application and renders the main `App` component.
 * 
 * @summary
 * - Imports React and ReactDOM for React's functionality and DOM manipulation.
 * - Imports `index.css` for global styling across the app.
 * - Imports the main `App` component that defines the core structure and routing.
 * - Imports `reportWebVitals` for measuring application performance (optional).
 *
 * @constant root - Represents the root DOM element where the React app is injected.
 *
 * @function render - Uses ReactDOM to render the `App` component inside the `root` element,
 *   wrapped in `React.StrictMode` to activate additional checks and warnings in development.
 *
 * `reportWebVitals()` is called to measure the app's performance if needed.
 */

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
