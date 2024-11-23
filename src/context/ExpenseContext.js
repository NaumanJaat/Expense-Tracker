import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, push, set, onValue } from 'firebase/database';
import database from '../firebase';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses from Firebase in real-time when the user is logged in
  useEffect(() => {
    if (user) {
      const expenseRef = ref(database, `users/${user.id}/expenses`);

      // Realtime listener to get updates
      const unsubscribe = onValue(expenseRef, (snapshot) => {
        const data = snapshot.val();
        setExpenses(data ? Object.values(data) : []);
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Add new expense
  const addExpense = (expense) => {
    if (!user) return;

    const expenseRef = ref(database, `users/${user.id}/expenses`);
    const newExpenseRef = push(expenseRef);
    set(newExpenseRef, expense);
  };

  // Remove an expense
  const removeExpense = (expenseID) => {
    if (!user) return;

    const expenseRef = ref(database, `users/${user.id}/expenses`);
    const updatedExpenses = expenses.filter(exp => exp.id !== expenseID);
    set(expenseRef, updatedExpenses);
    setExpenses(updatedExpenses);
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, removeExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => useContext(ExpenseContext);
