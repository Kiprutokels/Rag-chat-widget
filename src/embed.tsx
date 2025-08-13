import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Embeddable version with customization via data attributes
function EmbedApp() {
  const container = document.getElementById('rag-chat-widget');
  const config = container?.dataset || {};
  
  return (
    <div className="h-full">
      <App />
    </div>
  );
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('rag-chat-widget');
  if (container) {
    ReactDOM.createRoot(container).render(
      <React.StrictMode>
        <EmbedApp />
      </React.StrictMode>
    );
  }
});