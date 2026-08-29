import { createContext, useContext, useState, type ReactNode } from 'react';
import { authService, type AuthUser, type SignInResult } from '@/lib/auth-service';

type AuthContextValue = {
  user: AuthUser | null;
  signIn: (identifier: string, password: string, role: AuthUser['role'], remember: boolean) => SignInResult;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getUser());
  const signIn = (identifier: string, password: string, role: AuthUser['role'], remember: boolean) => {
    const result = authService.signIn(identifier, password, role, remember);
    if (result.ok) setUser(result.user);
    return result;
  };
  const signOut = () => { authService.signOut(); setUser(null); };
  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}