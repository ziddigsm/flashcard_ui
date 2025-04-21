import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { WarningProvider } from "./contexts/WarningContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WarningProvider>
      <App />
    </WarningProvider>
  </StrictMode>
);
