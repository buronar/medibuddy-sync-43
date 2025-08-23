import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Recording {
  id: string;
  filename: string;
  duration: string;
  timestamp: Date;
  user: string;
}

interface RecordingsContextType {
  recordings: Recording[];
  addRecording: (recording: Recording) => void;
  deleteRecording: (id: string) => void;
  updateRecording: (id: string, updates: Partial<Recording>) => void;
}

const RecordingsContext = createContext<RecordingsContextType | undefined>(undefined);

export const useRecordings = () => {
  const context = useContext(RecordingsContext);
  if (!context) {
    throw new Error('useRecordings must be used within a RecordingsProvider');
  }
  return context;
};

interface RecordingsProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'saudesync:recordings';

const loadRecordingsFromStorage = (): Recording[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return parsed.map((recording: any) => ({
        ...recording,
        timestamp: new Date(recording.timestamp)
      }));
    }
  } catch (error) {
    console.warn('Failed to load recordings from localStorage:', error);
  }
  return [];
};

export const RecordingsProvider = ({ children }: RecordingsProviderProps) => {
  const [recordings, setRecordings] = useState<Recording[]>(loadRecordingsFromStorage);

  // Save to localStorage whenever recordings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings));
    } catch (error) {
      console.warn('Failed to save recordings to localStorage:', error);
    }
  }, [recordings]);

  const addRecording = (recording: Recording) => {
    setRecordings(prev => [recording, ...prev]);
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(recording => recording.id !== id));
  };

  const updateRecording = (id: string, updates: Partial<Recording>) => {
    setRecordings(prev => 
      prev.map(recording => 
        recording.id === id ? { ...recording, ...updates } : recording
      )
    );
  };

  return (
    <RecordingsContext.Provider value={{
      recordings,
      addRecording,
      deleteRecording,
      updateRecording
    }}>
      {children}
    </RecordingsContext.Provider>
  );
};