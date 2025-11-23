import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

// ⭐ Fix: Apply SPA fallback before rendering
if (sessionStorage.path) {
  const path = sessionStorage.path;
  sessionStorage.removeItem("path");
  window.history.replaceState(null, null, path);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
