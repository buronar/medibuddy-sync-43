
import { useReminders } from '@/hooks/useReminders';
import { useLocation } from 'react-router-dom';

export const ReminderService = () => {
  const location = useLocation(); // This ensures we're in router context
  useReminders();
  return null;
};
