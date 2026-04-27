import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import { ApiKeyProvider } from "./context/ApiKeyContext.jsx";
import { BidProvider } from "./context/BidContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ApiKeyProvider>
        <ProfileProvider>
          <BidProvider>
            <App />
          </BidProvider>
        </ProfileProvider>
      </ApiKeyProvider>
    </AuthProvider>
  </StrictMode>
);