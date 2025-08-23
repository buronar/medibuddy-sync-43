import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Consultation {
  id: string;
  doctor?: string;
  specialty: string;
  date: Date;
  address?: string;
  notes?: string;
  recordingId?: string;
  status: 'Agendada' | 'Realizada';
  appointmentType?: 'presential' | 'telemedicine';
}

interface ConsultationsContextType {
  consultations: Consultation[];
  addConsultation: (consultation: Consultation) => void;
  deleteConsultation: (id: string) => void;
  updateConsultation: (id: string, updates: Partial<Consultation>) => void;
  associateRecording: (consultationId: string, recordingId: string) => void;
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

  return (
    <ConsultationsContext.Provider value={{
      consultations,
      addConsultation,
      deleteConsultation,
      updateConsultation,
      associateRecording
    }}>
      {children}
    </ConsultationsContext.Provider>
  );
};