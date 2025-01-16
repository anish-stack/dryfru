import React, { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username, password) => {
    
    if (username === 'admin' && password === 'admin123') {
      const user = {
        id: '1',
        username: 'admin',
        role: 'admin'
      };
      sessionStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};