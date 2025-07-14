import { 
  createContext, 
  useState, 
  useContext, 
  useCallback, 
  useMemo,
  useEffect 
} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [authToken, setAuthToken] = useState(() => Cookies.get("jwtToken")); // Changed from localStorage
  const [currentUserRole, setCurrentUserRole] = useState(() => {
    try {
      const userDetailsString = Cookies.get("userDetails"); // Changed from localStorage
      return userDetailsString ? JSON.parse(userDetailsString).role : null;
    } catch (e) {
      console.error("Failed to parse userDetails from cookie at startup:", e); // Changed from localStorage
      return null;
    }
  });

  const fetchNotifications = useCallback(async () => {
    try {
      const token = Cookies.get("jwtToken"); // Changed from localStorage
      const userDetailsString = Cookies.get("userDetails"); // Changed from localStorage
      let role = null;
      if (userDetailsString) {
        try {
          const userDetails = JSON.parse(userDetailsString);
          role = userDetails.role;
        } catch (parseError) {
          console.error("Error parsing userDetails from cookie in fetchNotifications:", parseError); // Changed from localStorage
        }
      }

      if (!token || role !== 'hr') {
        console.error("Authentication token or user role not found for notifications (in fetchNotifications).");
        setNotifications([]);
        return;
      }

      let notificationsApiUrl = '';
      if (role === 'hr') {
        notificationsApiUrl = '/api/hr/notifications';
      } else if (role === 'jobseeker') {
        notificationsApiUrl = '/api/jobseeker/notifications';
      } else {
        console.error(`Unsupported user role for notifications: ${role}`);
        setNotifications([]);
        return;
      }

      const response = await axios.get(notificationsApiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Debug: NotificationContext - Full response:", response);
      console.log("Debug: NotificationContext - response.data:", response.data);
      
      const fetchedNotifications = (response.data.notifications || response.data).map(n => ({
        id: n.notification_id,
        title: n.title,
        message: n.message,
        isRead: n.is_read === 1,
        date: new Date(n.created_at),
        type: n.type
      }));
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      console.log("authChange event triggered in NotificationContext");
      // Update local state from Cookies after auth change
      setAuthToken(Cookies.get("jwtToken")); // Changed from localStorage
      try {
        const userDetailsString = Cookies.get("userDetails"); // Changed from localStorage
        setCurrentUserRole(userDetailsString ? JSON.parse(userDetailsString).role : null);
      } catch (e) {
        console.error("Error parsing userDetails from cookie on authChange:", e); // Changed from localStorage
        setCurrentUserRole(null);
      }
      fetchNotifications(); // Re-fetch notifications after auth change
    };

    // Removed window.addEventListener('storage', handleAuthChange) as it's not needed for cookies
    window.addEventListener('authChange', handleAuthChange);

    fetchNotifications(); // Initial fetch on component mount

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.isRead).length,
    [notifications]
  );

  const markAsRead = useCallback(async (id) => {
    try {
      const token = Cookies.get("jwtToken"); // Changed from localStorage
      const userDetailsString = Cookies.get("userDetails"); // Changed from localStorage
      let role = null;
      if (userDetailsString) {
        try {
          const userDetails = JSON.parse(userDetailsString);
          role = userDetails.role;
        } catch (parseError) {
          console.error("Error parsing userDetails from cookie in markAsRead:", parseError); // Changed from localStorage
        }
      }

      if (!token || !role) {
        console.error("Authentication token or user role not found for marking notification as read.");
        return;
      }

      let markAsReadApiUrl = '';
      if (role === 'hr') {
        markAsReadApiUrl = `/api/hr/notifications/${id}`;
      } else if (role === 'jobseeker') {
        markAsReadApiUrl = `/api/jobseeker/notifications/${id}/read`;
      } else {
        console.error(`Unsupported user role for marking notification as read: ${role}`);
        return;
      }

      await axios.patch(markAsReadApiUrl, {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const token = Cookies.get("jwtToken"); // Changed from localStorage
      const userDetailsString = Cookies.get("userDetails"); // Changed from localStorage
      let role = null;
      if (userDetailsString) {
        try {
          const userDetails = JSON.parse(userDetailsString);
          role = userDetails.role;
        } catch (parseError) {
          console.error("Error parsing userDetails from cookie in markAllAsRead:", parseError); // Changed from localStorage
        }
      }

      if (!token || !role) {
        console.error("Authentication token or user role not found for marking all notifications as read.");
        return;
      }

      let markAllAsReadApiUrl = '';
      if (role === 'hr') {
        markAllAsReadApiUrl = '/api/hr/notifications/mark-all-read';
      } else if (role === 'jobseeker') {
        markAllAsReadApiUrl = '/api/jobseeker/notifications/mark-all-read';
      } else {
        console.error(`Unsupported user role for marking all notifications as read: ${role}`);
        return;
      }

      await axios.patch(markAllAsReadApiUrl, {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  const getNotificationsForDate = useCallback((date) => {
    if (!date) return [];
    return notifications.filter(n => 
      n.date &&
      n.date.getDate() === date.getDate() &&
      n.date.getMonth() === date.getMonth() &&
      n.date.getFullYear() === date.getFullYear()
    );
  }, [notifications]);

  const getUpcomingNotifications = useCallback(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return notifications.filter(n => 
      n.date && 
      n.date >= today && 
      n.date <= nextWeek &&
      !n.isRead
    );
  }, [notifications]);

  const addNotification = useCallback((title, message, date, type = "general") => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      isRead: false,
      date,
      type
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const deleteNotification = useCallback(async (id) => {
    try {
      const token = Cookies.get("jwtToken"); // Changed from localStorage
      const userDetailsString = Cookies.get("userDetails"); // Changed from localStorage
      let role = null;
      if (userDetailsString) {
        try {
          const userDetails = JSON.parse(userDetailsString);
          role = userDetails.role;
        } catch (parseError) {
          console.error("Error parsing userDetails from cookie in deleteNotification:", parseError); // Changed from localStorage
        }
      }

      if (!token || !role) {
        console.error("Authentication token or user role not found for deleting notification.");
        return;
      }

      let deleteNotificationApiUrl = '';
      if (role === 'hr') {
        deleteNotificationApiUrl = `/api/hr/notifications/${id}`;
      } else if (role === 'jobseeker') {
        deleteNotificationApiUrl = `/api/jobseeker/notifications/${id}`;
      } else {
        console.error(`Unsupported user role for deleting notification: ${role}`);
        return;
      }

      await axios.delete(deleteNotificationApiUrl,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []); // Remove dependencies as token/role are read inside

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationsForDate,
    getUpcomingNotifications,
    addNotification,
    deleteNotification
  }), [
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationsForDate,
    getUpcomingNotifications,
    addNotification,
    deleteNotification
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
};