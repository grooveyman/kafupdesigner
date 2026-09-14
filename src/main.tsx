import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-loading-skeleton/dist/skeleton.css";
import "sweetalert2/dist/sweetalert2.min.css";
import App from "./App.tsx";




createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
