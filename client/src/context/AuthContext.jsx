import { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nexo_token') || null);
  const [loading, setLoading] = useState(true);

  // App start hone par check karo user logged in hai ya nahi
  useEffect(() => {
    if (token) {
      apiClient
        .get('/auth/me')
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.user);
          }
        })
        .catch(() => {
          logout(); // Token expire ho gaya toh logout karo
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  // Login Function
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('nexo_token', userToken);
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nexo_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);