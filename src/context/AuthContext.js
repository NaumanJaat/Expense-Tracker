import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ref, set, get } from 'firebase/database';
import database from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Utility function to format large numbers for PKR
  const formatPKR = (number) => {
    if (number >= 1_000_000) {
      return `₨ ${(number / 1_000_000).toFixed(1)}M`; // Format as 1M+
    } else if (number >= 1_000) {
      return `₨ ${(number / 1_000).toFixed(1)}K`; // Format as 1K+
    }
    return `₨ ${number.toLocaleString()}`; // Use commas for numbers less than 1K
  };

  // Fetch user data and format totals
  const fetchUserData = useCallback(async (userID) => {
    try {
      const userRef = ref(database, `users/${userID}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        const totalIncome = userData.totalIncome || 0;
        const totalOutcome = userData.totalOutcome || 0;

        setUser({
          id: userID,
          name: userData.name,
          expenses: userData.expenses || [],
          totalIncome: formatPKR(totalIncome),
          totalOutcome: formatPKR(totalOutcome),
        });
        setError(null);
      } else {
        setError('User not found!');
        setUser(null);
      }
    } catch (err) {
      setError('Failed to fetch user data.');
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const userRef = ref(database, `users/${email.replace('.', '_')}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const storedPassword = snapshot.val().password;

        if (storedPassword === password) {
          await fetchUserData(email.replace('.', '_'));
          localStorage.setItem('userEmail', email);
          setError(null);
        } else {
          setError('Incorrect password!');
          setUser(null);
        }
      } else {
        setError('No account found for this email.');
        setUser(null);
      }
    } catch (err) {
      setError('Failed to log in.');
    }
  };

  // Create account function
  const createAccount = async (name, email, password) => {
    try {
      const userRef = ref(database, `users/${email.replace('.', '_')}`); // Use email as the user ID
      const newUser = { name, email, password, expenses: [], totalIncome: 0, totalOutcome: 0 };

      await set(userRef, newUser);
      // After account creation, set the user in context
      setUser({ name, email, expenses: [], totalIncome: formatPKR(0), totalOutcome: formatPKR(0) });
      localStorage.setItem('userEmail', email); // Store email in localStorage
      setError(null);
    } catch (err) {
      setError('Failed to create account.');
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userEmail');
  };

  // Check localStorage for existing login
  useEffect(() => {
    const storedUserEmail = localStorage.getItem('userEmail');
    if (storedUserEmail) {
      fetchUserData(storedUserEmail.replace('.', '_'));
    }
  }, [fetchUserData]);

  return (
    <AuthContext.Provider value={{ user, login, createAccount, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
