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
          <button type="button" className={styles.googleBtn}>
            <img 
              src="/icons/google.webp" 
              alt="Google logo" 
              className={styles.googleIcon}
            />
            Sign up with Google
          </button>
          <div className={styles.divider}>
            <span>OR</span>
          </div>
          <input 
            type="text" 
            id="username" 
            name="username" 
            placeholder="Username" 
            required 
          />
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Password" 
            required 
          />
          <input 
            type="password" 
            id="confirm_password" 
            name="confirm_password" 
            placeholder="Confirm Password" 
            required 
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className={`${styles.formContainer} ${styles.signIn}`}>
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>
          <button type="button" className={styles.googleBtn}>
            <img 
              src="/icons/google.webp" 
              alt="Google logo" 
              className={styles.googleIcon}
            />
            Sign in with Google
          </button>
          <div className={styles.divider}>
            <span>OR</span>
          </div>
          <input 
            type="text" 
            id="username" 
            name="username" 
            placeholder="Username" 
            required 
          />
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Password" 
            required 
          />
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
            <h1>Hey!</h1>
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