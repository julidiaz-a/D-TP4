import { useApp } from '../context/AppContext';
import '../index.css';

export default function Notification() {
  const { notification } = useApp();
  if (!notification) return null;

  return (
    <div className={`notification notification-${notification.type}`}>
      <span className="notif-icon">
        {notification.type === 'success' ? '✓' : '✕'}
      </span>
      {notification.message}
    </div>
  );
}
