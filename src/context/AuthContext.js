import React, { createContext, useContext, useState, useEffect } from "react";
import { ref, set, get } from "firebase/database";
import database from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Sanitize email for Firebase
  const sanitizeEmail = (email) => email.replace(/\./g, "_");

  // Fetch user data
  const fetchUserData = async (email) => {
    const sanitizedEmail = sanitizeEmail(email);
    const userRef = ref(database, `users/${sanitizedEmail}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      setUser({ id: sanitizedEmail, ...snapshot.val() });
    } else {
      setError("User not found!");
      setUser(null);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const sanitizedEmail = sanitizeEmail(email);
      const userRef = ref(database, `users/${sanitizedEmail}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const storedPassword = snapshot.val().password;
        if (storedPassword === password) {
          await fetchUserData(email);
          localStorage.setItem("userEmail", sanitizedEmail);
          setError(null);
        } else {
          setError("Incorrect password!");
        }
      } else {
        setError("User not found!");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to login.");
    }
  };

  // Create Account
  const createAccount = async (name, email, password) => {
    try {
      const sanitizedEmail = sanitizeEmail(email);
      const userRef = ref(database, `users/${sanitizedEmail}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        setError("An account with this email already exists!");
      } else {
        const newUser = {
          name,
          email,
          password,
          expenses: [],
        };
        await set(userRef, newUser);
        setUser({ id: sanitizedEmail, name, expenses: [] });
        localStorage.setItem("userEmail", sanitizedEmail);
        setError(null);
      }
    } catch (err) {
      console.error("Create account error:", err);
      setError("Failed to create an account.");
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userEmail");
  };

  // Auto-login on app load
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      fetchUserData(storedEmail);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, createAccount, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
