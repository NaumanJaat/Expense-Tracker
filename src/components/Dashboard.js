import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { expenses } = useExpense();

  if (!user) {
    return <p className={styles.message}>Please log in to view your dashboard.</p>;
  }

  // Filter expenses by user ID
  const userExpenses = expenses.filter((expense) => expense.userID === user.id);

  // Calculate totals
  const totalIncome = userExpenses
    .filter((expense) => expense.amount > 0)
    .reduce((acc, expense) => acc + expense.amount, 0);

  const totalOutcome = userExpenses
    .filter((expense) => expense.amount < 0)
    .reduce((acc, expense) => acc + Math.abs(expense.amount), 0);

  return (
    <div className={styles.dashboard}>
      <div className={styles.summary}>
        <div className={styles.total}>
          <h3>Total Income</h3>
          <p className={styles.income}>${totalIncome.toFixed(2)}</p>
        </div>
        <div className={styles.total}>
          <h3>Total Outcome</h3>
          <p className={styles.outcome}>${totalOutcome.toFixed(2)}</p>
        </div>
      </div>
      <ExpenseForm />
      <ExpenseList />
    </div>
  );
};

export default Dashboard;
