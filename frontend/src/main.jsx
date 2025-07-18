import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { NotificationProvider } from "./studentsComponents/contexts/NotificationContext.jsx";
import { UserJobProvider } from "./studentsComponents/contexts/UserJobContext.jsx";
import { UserDetailProvider } from "./studentsComponents/contexts/userDetailsContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "./index.css";
import App from "./App.jsx";
import { NotificationProvide } from "./Hrdashboard/contexts/Notification.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <UserDetailProvider>
        <UserJobProvider>
          <NotificationProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </NotificationProvider>
        </UserJobProvider>
      </UserDetailProvider>
    </AuthProvider>
  </StrictMode>
);
