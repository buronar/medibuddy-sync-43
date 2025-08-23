import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockSupabaseClient, User, Session, AuthError } from '@/lib/mockSupabaseClient';

// Context seguindo estrutura do Supabase Auth
interface AuthContextType {
  // Estados do Supabase
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  error: AuthError | null;
  
  // Métodos do Supabase Auth
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  
  // Compatibility com código existente
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>; // Mantido para compatibilidade
  logout: () => Promise<void>; // Mantido para compatibilidade
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // TEMPORÁRIO: Simula usuário autenticado automaticamente
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Simula usuário fake autenticado
        const fakeUser: User = {
          id: 'fake-user-temp',
          aud: 'authenticated',
          email: 'usuario.demo@saudesync.com',
          email_confirmed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_metadata: {
            name: 'Usuário Demo',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
          },
          app_metadata: {}
        };

        const fakeSession: Session = {
          access_token: 'fake-token-temp',
          refresh_token: 'fake-refresh-temp',
          expires_in: 3600,
          expires_at: Date.now() + (3600 * 1000),
          token_type: 'bearer',
          user: fakeUser
        };

        setSession(fakeSession);
        setUser(fakeUser);
      } catch (err) {
        setError({ message: 'Erro ao inicializar autenticação' });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Função signIn seguindo API do Supabase
  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await mockSupabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error);
        return { error };
      }

      setSession(data.session);
      setUser(data.user);
      return { error: null };
    } catch (err) {
      const authError = { message: 'Erro inesperado no login' };
      setError(authError);
      return { error: authError };
    } finally {
      setIsLoading(false);
    }
  };

  // Função signOut seguindo API do Supabase
  const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await mockSupabaseClient.auth.signOut();
      
      if (error) {
        setError(error);
        return { error };
      }

      setSession(null);
      setUser(null);
      return { error: null };
    } catch (err) {
      const authError = { message: 'Erro ao fazer logout' };
      setError(authError);
      return { error: authError };
    } finally {
      setIsLoading(false);
    }
  };

  // Funções de compatibilidade para código existente
  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await signIn(email, password);
    return !error;
  };

  const logout = async (): Promise<void> => {
    await signOut();
  };

  const isAuthenticated = session !== null && user !== null;

  return (
    <AuthContext.Provider value={{
      // Estados do Supabase
      session,
      user,
      isLoading,
      error,
      
      // Métodos do Supabase
      signIn,
      signOut,
      
      // Compatibilidade
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// TODO: Quando conectar Supabase real, substituir mockSupabaseClient por:
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(url, key)
// E usar supabase.auth.onAuthStateChange() para monitorar mudanças