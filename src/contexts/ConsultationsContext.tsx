import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Reminder {
  id: string;
  consultationId: string;
  type: '1day' | '3hours' | '1hour';
  scheduledTime: Date;
  delivered: boolean;
}

export interface Consultation {
  id: string;
  doctor?: string;
  specialty: string;
  date: Date;
  address?: string;
  notes?: string;
  recordingId?: string;
  status: 'Agendada' | 'Aguardando Data' | 'A Confirmar' | 'Realizada' | 'Não Compareceu';
  appointmentType?: 'presential' | 'telemedicine';
  patientNotes?: string;
  reminders?: Reminder[];
}

interface ConsultationsContextType {
  consultations: Consultation[];
  addConsultation: (consultation: Consultation) => void;
  deleteConsultation: (id: string) => void;
  updateConsultation: (id: string, updates: Partial<Consultation>) => void;
  associateRecording: (consultationId: string, recordingId: string) => void;
  addReminder: (consultationId: string, reminderType: '1day' | '3hours' | '1hour') => void;
  removeReminder: (consultationId: string, reminderType: '1day' | '3hours' | '1hour') => void;
}

const ConsultationsContext = createContext<ConsultationsContextType | undefined>(undefined);

export const useConsultations = () => {
  const context = useContext(ConsultationsContext);
  if (!context) {
    throw new Error('useConsultations must be used within a ConsultationsProvider');
  }
  return context;
};

interface ConsultationsProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'saudesync:consultations';

const loadConsultationsFromStorage = (): Consultation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((consultation: any) => ({
        ...consultation,
        date: new Date(consultation.date)
      }));
    }
  } catch (error) {
    console.warn('Failed to load consultations from localStorage:', error);
  }
  return [];
};

export const ConsultationsProvider = ({ children }: ConsultationsProviderProps) => {
  const [consultations, setConsultations] = useState<Consultation[]>(loadConsultationsFromStorage);

  // Auto-transition logic - check for consultations that need status update
  useEffect(() => {
    const now = new Date();
    let hasUpdates = false;
    
    const updatedConsultations = consultations.map(consultation => {
      if (consultation.status === 'Agendada' && consultation.date && consultation.date < now) {
        hasUpdates = true;
        return { ...consultation, status: 'A Confirmar' as const };
      }
      return consultation;
    });
    
    if (hasUpdates) {
      setConsultations(updatedConsultations);
    }
  }, [consultations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consultations));
    } catch (error) {
      console.warn('Failed to save consultations to localStorage:', error);
    }
  }, [consultations]);

  const addConsultation = (consultation: Consultation) => {
    setConsultations(prev => [consultation, ...prev]);
  };

  const deleteConsultation = (id: string) => {
    setConsultations(prev => prev.filter(consultation => consultation.id !== id));
  };

  const updateConsultation = (id: string, updates: Partial<Consultation>) => {
    setConsultations(prev => 
      prev.map(consultation => 
        consultation.id === id ? { ...consultation, ...updates } : consultation
      )
    );
  };

  const associateRecording = (consultationId: string, recordingId: string) => {
    updateConsultation(consultationId, { recordingId });
  };

  const calculateReminderTime = (consultationDate: Date, type: '1day' | '3hours' | '1hour'): Date => {
    const reminderTime = new Date(consultationDate);
    switch (type) {
      case '1day':
        reminderTime.setDate(reminderTime.getDate() - 1);
        break;
      case '3hours':
        reminderTime.setHours(reminderTime.getHours() - 3);
        break;
      case '1hour':
        reminderTime.setHours(reminderTime.getHours() - 1);
        break;
    }
    return reminderTime;
  };

  const addReminder = (consultationId: string, reminderType: '1day' | '3hours' | '1hour') => {
    const consultation = consultations.find(c => c.id === consultationId);
    if (!consultation) return;

    const scheduledTime = calculateReminderTime(consultation.date, reminderType);
    const newReminder: Reminder = {
      id: `${consultationId}-${reminderType}`,
      consultationId,
      type: reminderType,
      scheduledTime,
      delivered: false
    };

    updateConsultation(consultationId, {
      reminders: [...(consultation.reminders || []), newReminder]
    });
  };

  const removeReminder = (consultationId: string, reminderType: '1day' | '3hours' | '1hour') => {
    const consultation = consultations.find(c => c.id === consultationId);
    if (!consultation) return;

    const updatedReminders = (consultation.reminders || []).filter(
      r => r.type !== reminderType
    );

    updateConsultation(consultationId, {
      reminders: updatedReminders
    });
  };

  return (
    <ConsultationsContext.Provider value={{
      consultations,
      addConsultation,
      deleteConsultation,
      updateConsultation,
      associateRecording,
      addReminder,
      removeReminder
    }}>
      {children}
    </ConsultationsContext.Provider>
  );
};