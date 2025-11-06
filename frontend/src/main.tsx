import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 2000,
        className: "font-medium",
        style: {
          background: "#1c1917",
          color: "#fafaf9",
        },
        success: {
          className: "border border-stone-600",
          iconTheme: {
            primary: "#e11d48",
            secondary: "#1c1917",
          },
        },
        error: {
          className: "border border-stone-600",
          iconTheme: {
            primary: "#dc2626",
            secondary: "#1c1917",
          },
        },
        loading: {
          className: "border border-stone-600",
          iconTheme: {
            primary: "#e11d48",
            secondary: "#1c1917",
          },
        },
      }}
    />
    <App />
  </StrictMode>
);
