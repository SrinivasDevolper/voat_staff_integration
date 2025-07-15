import React, { createContext, useState } from "react";

export const UserDetailsContext = createContext();

export const UserDetailProvider = ({ children }) => {
  const [username, setUserName] = useState("");
  const [userBio, setUserBio] = useState("");

  return (
    <UserDetailsContext.Provider
      value={{ username, setUserName, userBio, setUserBio }}
    >
      {children}
    </UserDetailsContext.Provider>
  );
};
