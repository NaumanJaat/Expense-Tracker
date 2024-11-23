import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const { login, logout, error, user } = useAuth();
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (userID && password) {
      login(userID, password);
    }
  };

  const handleContactUs = () => {
    window.open("https://www.linkedin.com/in/nauman-liaqat-a21066255/", "_blank");
  };

  if (user) {
    return (
      <div className={styles.dashboard}>
        <h2>Welcome, {user.id}!</h2>
        <div className={styles.buttonGroup}>
          <button onClick={logout} className={styles.button}>Logout</button>
          <button onClick={handleContactUs} className={styles.contactButton}>Contact Us</button>
        </div>
      </div>
    );
  }
  
  

  return (
    <div className={styles.login}>
      <input
        type="text"
        placeholder="Enter User ID"
        value={userID}
        onChange={(e) => setUserID(e.target.value)}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleLogin} className={styles.button}>Login</button>
      {error && <p className={styles.error}>{error}</p>}
      <button onClick={handleContactUs} className={styles.contactButton}>Contact Us</button>
    </div>
  );
};

export default Login;
