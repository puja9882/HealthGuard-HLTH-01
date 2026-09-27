import { createContext, useContext, useState } from 'react';
import { login as loginRequest, register as registerRequest } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('hrs_user');
    return saved ? JSON.parse(saved) : null;
  });

  async function login(email, password, role) {
    const { user: loggedInUser } = await loginRequest(email, password, role);
    sessionStorage.setItem('hrs_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register(formData) {
    await registerRequest(formData);
    // Registration succeeds -> caller redirects to /login; we don't
    // auto-authenticate, matching "Registration successful -> redirect to Login".
    return true;
  }

  function logout() {
    sessionStorage.removeItem('hrs_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
