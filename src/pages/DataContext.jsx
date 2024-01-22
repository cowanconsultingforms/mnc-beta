// DataContext.js
import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);

  const setGlobalData = (newData) => {
    setData(newData);
  };

  return (
    <DataContext.Provider value={{ data, setGlobalData }}>
      {children}
    </DataContext.Provider>
  );
};
