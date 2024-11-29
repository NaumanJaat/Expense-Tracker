import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import styles from './ExpenseList.module.css';

const ExpenseList = () => {
  const { expenses, removeExpense } = useExpense();
  const { user } = useAuth();

  const userExpenses = expenses.filter((expense) => expense.userID === user.id);

  return (
    <div>
      <h2 className={styles.title}>Your Expenses</h2>
      <ul className={styles.list}>
        {userExpenses.map((expense) => (
          <li key={expense.id} className={styles.item}>
            {expense.date} - {expense.description} - RS{expense.amount}
            <button
              onClick={() => removeExpense(expense.id)}
              className={styles.button}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
