import React from 'react';

export interface AuthContextType {
  token: string | null;
  user: any;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
