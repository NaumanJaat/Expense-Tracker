import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import styles from './ExpenseForm.module.css';

const ExpenseForm = () => {
  const { addExpense } = useExpense();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('income'); // New state for type selection

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && description && date) {
      // Convert amount to negative if it's an expense
      const adjustedAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

      addExpense({
        id: Date.now(),
        userID: user.id,
        amount: adjustedAmount,
        description,
        date,
        type, // Store the type for reference (optional)
      });

      // Clear inputs
      setAmount('');
      setDescription('');
      setDate('');
      setType('income');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className={styles.select}
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={styles.input}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={styles.input}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>Add {type}</button>
    </form>
  );
};

export default ExpenseForm;
