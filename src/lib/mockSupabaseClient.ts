// Mock Supabase Client - Simulação da API do Supabase Auth
// TODO: Substituir por createClient() quando conectar Supabase real

export interface User {
  id: string;
  aud: string;
  email: string;
  email_confirmed_at?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  user_metadata: {
    name?: string;
    avatar_url?: string;
  };
  app_metadata: Record<string, any>;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: User;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  data: {
    user: User | null;
    session: Session | null;
  };
  error: AuthError | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

// Simula delay de rede
const simulateNetworkDelay = () => 
  new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

// Gera dados de usuário simulados
const createMockUser = (email: string): User => ({
  id: `mock-user-${Date.now()}`,
  aud: 'authenticated',
  email,
  email_confirmed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_metadata: {
    name: email.split('@')[0], // Nome baseado no email
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
  },
  app_metadata: {}
});

// Gera sessão simulada
const createMockSession = (user: User): Session => ({
  access_token: `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  refresh_token: `mock-refresh-${Date.now()}`,
  expires_in: 3600,
  expires_at: Date.now() + (3600 * 1000),
  token_type: 'bearer',
  user
});

// Chaves do localStorage
const SESSION_KEY = 'supabase.auth.session';
const USER_KEY = 'supabase.auth.user';

class MockSupabaseAuth {
  // Simula signInWithPassword
  async signInWithPassword(credentials: SignInCredentials): Promise<AuthResponse> {
    await simulateNetworkDelay();

    const { email, password } = credentials;

    // Validação básica (aceita qualquer email/senha preenchidos)
    if (!email || !password) {
      return {
        data: { user: null, session: null },
        error: { message: 'Email e senha são obrigatórios' }
      };
    }

    if (!email.includes('@')) {
      return {
        data: { user: null, session: null },
        error: { message: 'Email inválido' }
      };
    }

    if (password.length < 3) {
      return {
        data: { user: null, session: null },
        error: { message: 'Senha deve ter pelo menos 3 caracteres' }
      };
    }

    // Sucesso - cria usuário e sessão
    const user = createMockUser(email);
    const session = createMockSession(user);

    // Persiste no localStorage
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return {
      data: { user, session },
      error: null
    };
  }

  // Simula signOut
  async signOut(): Promise<{ error: AuthError | null }> {
    await simulateNetworkDelay();

    // Remove do localStorage
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);

    return { error: null };
  }

  // Simula getSession
  async getSession(): Promise<{ data: { session: Session | null }, error: AuthError | null }> {
    await new Promise(resolve => setTimeout(resolve, 100)); // Delay menor

    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (!sessionData) {
        return { data: { session: null }, error: null };
      }

      const session: Session = JSON.parse(sessionData);
      
      // Verifica se a sessão expirou
      if (session.expires_at && session.expires_at < Date.now()) {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(USER_KEY);
        return { data: { session: null }, error: null };
      }

      return { data: { session }, error: null };
    } catch (error) {
      return { 
        data: { session: null }, 
        error: { message: 'Erro ao recuperar sessão' }
      };
    }
  }

  // Simula getUser
  async getUser(): Promise<{ data: { user: User | null }, error: AuthError | null }> {
    const { data: { session } } = await this.getSession();
    
    if (!session) {
      return { data: { user: null }, error: null };
    }

    return { data: { user: session.user }, error: null };
  }
}

// Mock do cliente Supabase - estrutura similar ao real
export const mockSupabaseClient = {
  auth: new MockSupabaseAuth()
};

// TODO: Quando conectar Supabase real, substituir por:
// import { createClient } from '@supabase/supabase-js'
// export const supabase = createClient(url, key)