import { 
  createContext, 
  useState, 
  useContext, 
  useCallback, 
  useMemo,
  useEffect 
} from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]); // Initialize as empty array
  
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get('/api/jobseeker/notifications', { withCredentials: true });
      const fetchedNotifications = response.data.notifications.map(n => ({
        id: n.notification_id,
        text: n.title, // Placeholder, will refine based on user input
        read: n.is_read === 1,
        date: new Date(n.created_at),
        type: n.type
      }));
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Optionally, set an error state or show a toast notification
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  const markAsRead = useCallback(async (id) => {
    try {
      await axios.put(`/api/jobseeker/notifications/${id}/read`, {}, { withCredentials: true });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await axios.put('/api/jobseeker/notifications/mark-all-read', {}, { withCredentials: true });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
      !n.read
    );
  }, [notifications]);

  const addNotification = useCallback((text, date, type = "general") => {
    // This function might be less relevant if all notifications come from backend
    // but kept for potential frontend-only notifications or immediate updates
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
    // Implement backend API call for deletion if needed
    try {
      await axios.delete(`/api/jobseeker/notifications/${id}`, { withCredentials: true });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
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