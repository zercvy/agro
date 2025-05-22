import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/axios';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  checkAuth: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = async () => {
    try {
      const res = await API.get('/me');
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      const res = await API.get('/csrf-token');
      await API.post('/logout', null, {
        headers: { 'X-CSRF-Token': res.data.csrfToken },
      });
      setUser(null);
    } catch (err) {
      console.error('Ошибка выхода', err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
