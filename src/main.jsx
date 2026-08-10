import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'; // Import the ErrorBoundary

// Every route is a separate lazy-loaded chunk with a build-hash in its
// filename (e.g. Autisme-pQ7f1SPZ.js). If a tab has been open since before
// the latest deploy and the user then navigates to a route whose chunk
// changed, the browser requests a filename that no longer exists on the
// server - our SPA fallback rewrite serves index.html for that 404 instead,
// so the browser gets HTML where it expected a JS module and the dynamic
// import throws. Vite fires this event for exactly that case; reloading
// picks up the current index.html and its correct chunk references.
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary> {/* Wrap the App component with ErrorBoundary */}
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)