import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchRoles } from '../services/roleService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      loadRoles(user.id_rol);
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const loadRoles = async (userRoleId) => {
    try {
      const rolesData = await fetchRoles();
      const userRoles = rolesData.filter(role => role.id_rol === userRoleId);
      setRoles(userRoles);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ user, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);