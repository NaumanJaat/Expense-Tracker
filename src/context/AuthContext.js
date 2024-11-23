import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, set, get } from 'firebase/database';
import database from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user data from Firebase
  const fetchUserData = async (userID) => {
    const userRef = ref(database, `users/${userID}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      setUser({ id: userID, expenses: snapshot.val().expenses || [] });
    } else {
      setError("User not found!");
      setUser(null);
    }
  };

  // Handle user login
  const login = async (userID, password) => {
    const userRef = ref(database, `users/${userID}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const storedPassword = snapshot.val().password;

      // If passwords match, load user data
      if (storedPassword === password) {
        await fetchUserData(userID);
        localStorage.setItem('userID', userID);  // Store userID in localStorage for session
        setError(null);
      } else {
        setError("Incorrect password!");
        setUser(null);
      }
    } else {
      // If user doesn't exist, create a new user with the entered password and empty expenses
      const newUser = { password, expenses: [] };
      await set(userRef, newUser);
      setUser({ id: userID, expenses: [] });
      localStorage.setItem('userID', userID);
      setError(null);
    }
  };

  // Handle user logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userID');
  };

  // Check if user is logged in from localStorage on app load
  useEffect(() => {
    const storedUserID = localStorage.getItem('userID');
    if (storedUserID) {
      fetchUserData(storedUserID);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
