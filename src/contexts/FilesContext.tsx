import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FileCategory = 'receita' | 'exame' | 'laudo' | 'solicitacao' | 'outro';

export interface AttachedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string; // Simulated URL
  uploadDate: Date;
  consultationId: string;
  category: FileCategory;
}

interface FilesContextType {
  files: AttachedFile[];
  addFile: (file: AttachedFile) => void;
  deleteFile: (id: string) => void;
  updateFile: (id: string, updates: Partial<AttachedFile>) => void;
  getFilesByConsultation: (consultationId: string) => AttachedFile[];
  getFilesByCategory: (consultationId: string, category: FileCategory) => AttachedFile[];
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export const useFiles = () => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
};

interface FilesProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'saudesync:files';

const loadFilesFromStorage = (): AttachedFile[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((file: any) => ({
        ...file,
        uploadDate: new Date(file.uploadDate)
      }));
    }
  } catch (error) {
    console.warn('Failed to load files from localStorage:', error);
  }
  return [];
};

export const FilesProvider = ({ children }: FilesProviderProps) => {
  const [files, setFiles] = useState<AttachedFile[]>(loadFilesFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    } catch (error) {
      console.warn('Failed to save files to localStorage:', error);
    }
  }, [files]);

  const addFile = (file: AttachedFile) => {
    setFiles(prev => [file, ...prev]);
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const updateFile = (id: string, updates: Partial<AttachedFile>) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, ...updates } : file
    ));
  };

  const getFilesByConsultation = (consultationId: string) => {
    return files.filter(file => file.consultationId === consultationId);
  };

  const getFilesByCategory = (consultationId: string, category: FileCategory) => {
    return files.filter(file => 
      file.consultationId === consultationId && file.category === category
    );
  };

  return (
    <FilesContext.Provider value={{
      files,
      addFile,
      deleteFile,
      updateFile,
      getFilesByConsultation,
      getFilesByCategory
    }}>
      {children}
    </FilesContext.Provider>
  );
};