
import { 
  createContext, 
  useState, 
  useContext, 
  useCallback, 
  useMemo,
  useEffect // Import useEffect
} from 'react';
import axios from 'axios'; // Import axios
import Cookies from 'js-cookie'; // Import Cookies
import { apiUrl } from '../../utilits/apiUrl'; // Import apiUrl

const NotificationContext = createContext();

export const NotificationProvide = ({ children }) => {
  const [notifications, setNotifications] = useState([]); // Initialize with empty array

  const fetchNotifications = useCallback(async () => {
    try {
      const token = Cookies.get('jwtToken');
      if (!token) {
        console.log("No JWT token found for notifications.");
        setNotifications([]);
        return;
      }
      const response = await axios.get(`${apiUrl}/hr/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Map backend data to frontend structure if necessary
      const fetchedNotifications = response.data.map(notif => ({
        id: notif.notification_id,
        text: notif.message,
        read: notif.is_read === 1, // Assuming is_read is TINYINT(1)
        date: new Date(notif.created_at),
        type: notif.type,
      }));
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Optionally, set an error state or display a toast
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds (adjust as needed)
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  const markAsRead = useCallback(async (id) => {
    try {
      const token = Cookies.get('jwtToken');
      if (!token) return;
      await axios.patch(`${apiUrl}/hr/notifications/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const token = Cookies.get('jwtToken');
      if (!token) return;
      await axios.patch(`${apiUrl}/hr/notifications/mark-all-read`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
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
      !n.read
    );
  }, [notifications]);

  const addNotification = useCallback((text, date, type = "general") => {
    // This function can be used to manually add a notification to the local state
    // For real-time updates, the backend should ideally send a new notification that's then fetched.
    const newNotification = {
      id: Date.now(),
      text,
      read: false,
      date,
      type
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const deleteNotification = useCallback(async (id) => {
    try {
      const token = Cookies.get('jwtToken');
      if (!token) return;
      // Assuming a backend endpoint for deleting a single notification
      // await axios.delete(`${apiUrl}/hr/notifications/${id}`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
    setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }, []);

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