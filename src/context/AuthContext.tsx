import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiClient, getRefreshPromise } from '../api/client';
import {
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from '../api/tokenStore';

interface AuthResponse {
  user: { id: string; email: string };
  accessToken: string;
  refreshToken: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isResolving: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isResolving, setIsResolving] = useState(true);

  useEffect(() => {
    async function resolveAuth() {
      const storedRefreshToken = getRefreshToken();

      if (!storedRefreshToken) {
        setIsResolving(false);
        return;
      }

      try {
        await getRefreshPromise();
        setIsAuthenticated(true);
      } catch {
        clearTokens();
        setIsAuthenticated(false);
      } finally {
        setIsResolving(false);
      }
    }

    resolveAuth();
  }, []);

  async function login(email: string, password: string) {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', {
      email,
      password,
    });
    setAccessToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);
    setIsAuthenticated(true);
  }

  async function register(email: string, password: string) {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', {
      email,
      password,
    });
    setAccessToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);
    setIsAuthenticated(true);
  }

  function logout() {
    clearTokens();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isResolving, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}