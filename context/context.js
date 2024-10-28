'use client'
import { createContext, useState, useContext } from "react";

export const usercontext = createContext();

export default function Context({ children }) {
    const [userId, setuserId] = useState();
  
    return (
      <usercontext.Provider value={{ userId, setuserId }}>
        {children}
      </usercontext.Provider>
    );
  }
  

export function useUserContext() {
    return useContext(usercontext);
  }