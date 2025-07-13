import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { NotificationProvider } from "./studentsComponents/contexts/NotificationContext.jsx";
import { UserJobProvider } from "./studentsComponents/contexts/UserJobContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "./index.css";
import App from "./App.jsx";
import { NotificationProvide } from "./Hrdashboard/contexts/Notification.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <UserJobProvider>
        <NotificationProvider>
          <NotificationProvide>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </NotificationProvide>
        </NotificationProvider>
      </UserJobProvider>
    </AuthProvider>
  </StrictMode>
);
