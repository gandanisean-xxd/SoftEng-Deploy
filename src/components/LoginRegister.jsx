import React, { useState } from "react";
import styles from "./LoginRegister.module.css"; // Import the CSS Module

const LoginRegister = ({ closeModal }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleForm = () => {
    setIsActive(!isActive);
  };

  const handleLogin = () => {
    // Placeholder for login functionality
    console.log("Login button clicked");
    closeModal(); // Close the modal after login
  };

  const handleRegister = () => {
    // Placeholder for register functionality
    console.log("Register button clicked");
  };

  return (
    <div className={`${styles.container} ${isActive ? styles.active : ""}`} id="container">
      {/* Sign Up Form */}
      <div className={`${styles.formContainer} ${styles.signUp}`}>
        <form onSubmit={handleRegister}>
          <h1>Create Account</h1>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.icon}>
              <i className="fa-brands fa-google-plus-g"></i>
            </a>           
          </div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
          <label htmlFor="confirm_password">Confirm Password</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className={`${styles.formContainer} ${styles.signIn}`}>
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.icon}>
              <i className="fa-brands fa-google-plus-g"></i>
            </a>
            
          </div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
          <a href="#">Forget Your Password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* Toggle Container */}
      <div className={styles.toggleContainer}>
        <div className={styles.toggle}>
          <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
            <h1>Welcome!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button className={styles.hidden} id="login" onClick={toggleForm}>
              Sign In
            </button>
          </div>
          <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all of site features</p>
            <button className={styles.hidden} id="register" onClick={toggleForm}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;