import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse } from '../types';

interface AuthContextType {
  token: string | null;
  username: string | null;
  role: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'jwt_token';
const USERNAME_KEY = 'username';
const ROLE_KEY = 'role';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [username, setUsername] = useState<string | null>(localStorage.getItem(USERNAME_KEY));
  const [role, setRole] = useState<string | null>(localStorage.getItem(ROLE_KEY));

  const login = async (username: string, password: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }

    const authData: AuthResponse = data.data;
    
    setToken(authData.token);
    setUsername(authData.username);
    setRole(authData.role);

    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USERNAME_KEY, authData.username);
    localStorage.setItem(ROLE_KEY, authData.role);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setRole(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ROLE_KEY);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, username, role, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
