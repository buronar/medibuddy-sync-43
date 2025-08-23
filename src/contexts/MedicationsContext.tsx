import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
  imageUrl?: string;
  createdAt: Date;
}

interface MedicationsContextType {
  medications: Medication[];
  addMedication: (medication: Medication) => void;
  deleteMedication: (id: string) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
}

const MedicationsContext = createContext<MedicationsContextType | undefined>(undefined);

export const useMedications = () => {
  const context = useContext(MedicationsContext);
  if (!context) {
    throw new Error('useMedications must be used within a MedicationsProvider');
  }
  return context;
};

interface MedicationsProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'saudesync:medications';

const loadMedicationsFromStorage = (): Medication[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((medication: any) => ({
        ...medication,
        createdAt: new Date(medication.createdAt)
      }));
    }
  } catch (error) {
    console.warn('Failed to load medications from localStorage:', error);
  }
  return [];
};

export const MedicationsProvider = ({ children }: MedicationsProviderProps) => {
  const [medications, setMedications] = useState<Medication[]>(loadMedicationsFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
    } catch (error) {
      console.warn('Failed to save medications to localStorage:', error);
    }
  }, [medications]);

  const addMedication = (medication: Medication) => {
    setMedications(prev => [medication, ...prev]);
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(medication => medication.id !== id));
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications(prev => 
      prev.map(medication => 
        medication.id === id ? { ...medication, ...updates } : medication
      )
    );
  };

  return (
    <MedicationsContext.Provider value={{
      medications,
      addMedication,
      deleteMedication,
      updateMedication
    }}>
      {children}
    </MedicationsContext.Provider>
  );
};