import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  // Check authentication status on mount and when cookies change
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = Cookies.get("jwtToken");
      const userDetailsCookie = Cookies.get("userDetails");
      
      if (token && userDetailsCookie) {
        try {
          const user = JSON.parse(userDetailsCookie);
          setIsLoggedIn(true);
          setUserDetails(user);
        } catch (error) {
          console.error("Invalid userDetails cookie:", error);
          logout();
        }
      } else {
        setIsLoggedIn(false);
        setUserDetails(null);
      }
    };

    checkAuthStatus();

    // Listen for storage events (when cookies change in other tabs)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also check periodically for cookie changes
    const interval = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const login = (token, user) => {
    Cookies.set("jwtToken", token, { expires: 7 });
    Cookies.set("userDetails", JSON.stringify(user), { expires: 7 });
    setIsLoggedIn(true);
    setUserDetails(user);
  };

  const logout = () => {
    Cookies.remove("jwtToken");
    Cookies.remove("userDetails");
    setIsLoggedIn(false);
    setUserDetails(null);
  };

  const value = {
    isLoggedIn,
    userDetails,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 