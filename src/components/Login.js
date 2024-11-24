import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./Login.module.css";
import Footer from "../components/Footer"; // Import Footer

const Login = () => {
  const { login, createAccount, logout, error, user } = useAuth();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      login(email, password);
    }
  };

  const handleCreateAccount = () => {
    if (name && email && password) {
      createAccount(name, email, password);
    }
  };

  const toggleForm = () => {
    setIsCreatingAccount(!isCreatingAccount);
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleContactUs = () => {
    window.open(
      "https://www.linkedin.com/in/nauman-liaqat-a21066255/",
      "_blank"
    );
  };

  if (user) {
    return (
      <div className={styles.dashboard}>
        <h2>Welcome, {user.name}!</h2>
        <div className={styles.buttonGroup}>
          <button onClick={logout} className={styles.button}>
            Logout
          </button>
          <button onClick={handleContactUs} className={styles.contactButton}>
            Contact Us
          </button>
        </div>
        <Footer /> {/* Footer here */}
      </div>
    );
  }

  return (
    <div className={styles.login}>
      <h2>Expense Tracker App</h2>
      {isCreatingAccount ? (
        <>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password (uppercase, lowercase, character, number)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleCreateAccount} className={styles.button}>
            Create Account
          </button>
          <button onClick={toggleForm} className={styles.link}>
            Back to Login
          </button>
        </>
      ) : (
        <>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleLogin} className={styles.button}>
            Login
          </button>
          <button onClick={toggleForm} className={styles.link}>
            Create New Account
          </button>
          <button onClick={handleContactUs} className={styles.contactButton}>
            Contact Us
          </button>
        </>
      )}
      {error && <p className={styles.error}>{error}</p>}
      <Footer /> {/* Footer here */}
    </div>
  );
};

export default Login;
