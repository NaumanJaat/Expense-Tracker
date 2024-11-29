import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, logout } = useAuth(); // Import `logout` from AuthContext
  const { expenses } = useExpense();

  // Contact Us Handler
  const handleContactUs = () => {
    alert('Contact us at support@example.com');
  };

  // Utility function to format PKR
  const formatPKR = (number) => {
    if (number >= 1_000_000) {
      return `₨ ${(number / 1_000_000).toFixed(1)}M`;
    } else if (number >= 1_000) {
      return `₨ ${(number / 1_000).toFixed(1)}K`;
    }
    return `₨ ${number.toLocaleString()}`;
  };

  // Ensure user exists before proceeding
  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
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

  // Calculate available balance
  const balance = totalIncome - totalOutcome;

  return (
    <div className={styles.dashboard}>

      {/* Summary Section */}
      <div className={styles.summary}>
        <div className={styles.total}>
          <h3>Total Income</h3>
          <p className={`${styles.amount} ${styles.income}`}>{formatPKR(totalIncome)}</p>
        </div>
        <div className={styles.total}>
          <h3>Total Outcome</h3>
          <p className={`${styles.amount} ${styles.outcome}`}>{formatPKR(totalOutcome)}</p>
        </div>
        <div className={`${styles.total} ${styles.balanceContainer}`}>
          <h3>Available Balance</h3>
          <p className={`${styles.amount} ${styles.balance}`}>{formatPKR(balance)}</p>
        </div>
      </div>

  

      {/* Expense Form and List */}
      <ExpenseForm />
      <ExpenseList />
    </div>
  );
};

export default Dashboard;
