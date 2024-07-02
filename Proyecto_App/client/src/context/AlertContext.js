import React, { createContext, useState, useContext } from 'react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <AlertContext.Provider value={{ showAlert, setShowAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
