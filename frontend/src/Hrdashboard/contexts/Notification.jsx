
import { 
  createContext, 
  useState, 
  useContext, 
  useCallback, 
  useMemo 
} from 'react';

const NotificationContext = createContext();

export const NotificationProvide = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      text: "HR from TechCorp scheduled an interview for April 15", 
      read: false, 
      date: new Date(2025, 3, 15),
      type: "interview"
    },
    { 
      id: 10, 
      text: "HR from TechCorp scheduled an interview for April 15", 
      read: false, 
      date: new Date(2025, 3, 15),
      type: "interview"
    },
    { 
      id: 11, 
      text: "HR from TechCorp scheduled an interview for April 15", 
      read: false, 
      date: new Date(2025, 3, 15),
      type: "interview"
    },
    { 
      id: 12, 
      text: "HR from TechCorp scheduled an interview for April 15", 
      read: false, 
      date: new Date(2025, 3, 15),
      type: "interview"
    },
    { 
      id: 2, 
      text: "Reminder: Interview with DesignHub tomorrow at 2 PM", 
      read: true, 
      date: new Date(2025, 3, 18),
      type: "reminder"
    },
    { 
      id: 3, 
      text: "New job posting matches your profile", 
      read: false,
      type: "job-alert" 
    },
    { 
      id: 4, 
      text: "Follow-up required for application submitted April 3", 
      read: false, 
      date: new Date(2025, 3, 3),
      type: "follow-up"
    },
  ]);

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
    const newNotification = {
      id: Date.now(),
      text,
      read: false,
      date,
      type
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
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