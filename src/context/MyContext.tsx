"use client";
import React, { createContext, useContext, useState } from "react";

interface Token {
  token: string;
}

interface MyContextType {
  url: string;

  setUrl: (newUrl: string) => void;

  localValueSetter: (data: Token | null) => void;
  isCreated: boolean;
  setIsCreated: (newValue: boolean) => void;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};

export const MyContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [url, setUrl] = useState<string>("");
  const [token, setToken] = useState<Token | null>(null);
  const [isCreated, setIsCreated] = useState<boolean>(false);

  const localValueSetter = (data: Token | null) => {
    localStorage.setItem("user", JSON.stringify(data));
  };

  return (
    <MyContext.Provider
      value={{
        localValueSetter,
        url,
        setUrl,
        isCreated,
        setIsCreated,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
