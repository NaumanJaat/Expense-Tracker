import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import styles from './App.module.css';

function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <div className={styles.app}>
          <h1 className={styles.title}>Expense Tracker App</h1>
          <Login />
          <Dashboard />
        </div>
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;
