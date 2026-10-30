import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

// Register the PWA service worker (was never registered before — offline mode was dead code)
if ("serviceWorker" in navigator && !window.location.hostname.startsWith("localhost")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* SW registration failure must never break the app */
    });
  });
}
