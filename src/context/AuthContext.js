import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ref, set, get, push } from 'firebase/database';
import database from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Utility function to format large numbers for PKR
  const formatPKR = (number) => {
    if (number >= 1_000_000) {
      return `₨ ${(number / 1_000_000).toFixed(1)}M`;
    } else if (number >= 1_000) {
      return `₨ ${(number / 1_000).toFixed(1)}K`;
    }
    return `₨ ${number.toLocaleString()}`;
  };

  // Fetch user data
  const fetchUserData = useCallback(async (userID) => {
    try {
      const userRef = ref(database, `users/${userID}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        const totalIncome = userData.totalIncome || 0;
        const totalOutcome = userData.totalOutcome || 0;
        const balance = totalIncome - totalOutcome;

        setUser({
          id: userID,
          name: userData.name,
          expenses: userData.expenses || [],
          totalIncome: formatPKR(totalIncome),
          totalOutcome: formatPKR(totalOutcome),
          balance: formatPKR(balance), // New balance field
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
      const userRef = ref(database, `users/${email.replace('.', '_')}`);
      const newUser = { name, email, password, expenses: [], totalIncome: 0, totalOutcome: 0 };

      await set(userRef, newUser);
      setUser({ name, email, expenses: [], totalIncome: formatPKR(0), totalOutcome: formatPKR(0), balance: formatPKR(0) });
      localStorage.setItem('userEmail', email);
      setError(null);
    } catch (err) {
      setError('Failed to create account.');
    }
  };

  // Add Income
  const addIncome = async (amount) => {
    if (!user) return;

    const userRef = ref(database, `users/${user.id}`);
    const newTotalIncome = parseInt(user.totalIncome.replace(/[^\d]/g, '')) + amount;
    const newBalance = newTotalIncome - parseInt(user.totalOutcome.replace(/[^\d]/g, ''));

    await set(userRef, { ...user, totalIncome: newTotalIncome, balance: newBalance });
    setUser((prevUser) => ({
      ...prevUser,
      totalIncome: formatPKR(newTotalIncome),
      balance: formatPKR(newBalance),
    }));
  };

  // Add Expense
  const addExpense = async (amount) => {
    if (!user) return;

    const userRef = ref(database, `users/${user.id}`);
    const newTotalOutcome = parseInt(user.totalOutcome.replace(/[^\d]/g, '')) + amount;
    const newBalance = parseInt(user.totalIncome.replace(/[^\d]/g, '')) - newTotalOutcome;

    await set(userRef, { ...user, totalOutcome: newTotalOutcome, balance: newBalance });
    setUser((prevUser) => ({
      ...prevUser,
      totalOutcome: formatPKR(newTotalOutcome),
      balance: formatPKR(newBalance),
    }));
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
    <AuthContext.Provider value={{ user, login, createAccount, logout, addIncome, addExpense, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
