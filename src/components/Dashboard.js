import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { expenses } = useExpense();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleContactUs = () => {
    alert('Contact us at support@example.com');
  };

  const formatPKR = (number) => {
    if (number >= 1_000_000) {
      return `₨ ${(number / 1_000_000).toFixed(1)}M`;
    } else if (number >= 1_000) {
      return `₨ ${(number / 1_000).toFixed(1)}K`;
    }
    return `₨ ${number.toLocaleString()}`;
  };

  if (!user) {
    return <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#333' }}>
      Please log in to view your dashboard.
    </div>;
  }

  const userExpenses = expenses.filter((expense) => expense.userID === user.id);

  const totalIncome = userExpenses
    .filter((expense) => expense.amount > 0)
    .reduce((acc, expense) => acc + expense.amount, 0);

  const totalOutcome = userExpenses
    .filter((expense) => expense.amount < 0)
    .reduce((acc, expense) => acc + Math.abs(expense.amount), 0);

  const balance = Math.max(totalIncome - totalOutcome, 0);

  const chartData = [
    { name: 'Income', amount: totalIncome, fill: '#4CAF50' },
    { name: 'Expenses', amount: totalOutcome, fill: '#F44336' },
    { name: 'Balance', amount: balance, fill: '#2196F3' }
  ];

  const expensesByMonth = Array.from({ length: 12 }, (_, index) => {
    const monthExpenses = userExpenses.filter(expense => new Date(expense.date).getMonth() === index && new Date(expense.date).getFullYear() === selectedYear);
    const total = monthExpenses.reduce((acc, expense) => acc + Math.abs(expense.amount), 0);
    return { month: new Date(0, index).toLocaleString('default', { month: 'short' }), total };
  });

  const years = [...new Set(userExpenses.map(expense => new Date(expense.date).getFullYear()))];

  return (
    <div className={styles.dashboard}>
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

      <div className={styles.chartContainer}>
        <h3>Financial Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" barSize={50}>
              {chartData.map((entry, index) => (
                <Bar key={index} dataKey="amount" fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.chartContainer}>
        <h3>Monthly Expenses Overview</h3>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Select Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #2196F3', backgroundColor: '#f0f8ff', color: '#333', fontWeight: 'bold' }}
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={expensesByMonth}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#F44336" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ExpenseForm />
      <ExpenseList />
    </div>
  );
};

export default Dashboard;
