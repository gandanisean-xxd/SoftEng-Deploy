import React, { useState } from "react";
import styles from "./LoginRegister.module.css";

const LoginRegister = ({ closeModal }) => {
  const [isActive, setIsActive] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  // Separate states for admin and regular login
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });
  
  const [userCredentials, setUserCredentials] = useState({
    username: '',
    password: ''
  });

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState({
    adminPassword: false,
    userPassword: false,
    registerPassword: false,
    confirmPassword: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const toggleForm = () => {
    setIsActive(!isActive);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Regular login:", userCredentials);
    closeModal();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Register button clicked");
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    console.log("Admin login:", adminCredentials);
  };

  const toggleAdminMode = () => {
    setIsAdminLogin(!isAdminLogin);
    // Clear inputs when switching modes
    setAdminCredentials({ username: '', password: '' });
    setUserCredentials({ username: '', password: '' });
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`${styles.container} ${isActive ? styles.active : ""}`} id="container">
      <button 
        className={styles.adminBtn0}
        onClick={toggleAdminMode}
      >
        <img 
          src="/icons/profile.png"
          alt="Admin login" 
          className={styles.adminIcon0}
        />
      </button>

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
          <div className={styles.passwordWrapper}>
            <input 
              type={showPassword.registerPassword ? "text" : "password"} 
              id="password" 
              name="password" 
              placeholder="Password" 
              required 
              className={styles.largerDots}
            />
            <button 
              type="button" 
              className={styles.togglePassword} 
              onClick={() => togglePasswordVisibility('registerPassword')}
            >
              {showPassword.registerPassword ? 
                <img src="/icons/ayclose.png" alt="Hide" className={styles.eyeIcon} /> : 
                <img src="/icons/ay.png" alt="Show" className={styles.eyeIcon} />
              }
            </button>
          </div>
          <div className={styles.passwordWrapper}>
            <input 
              type={showPassword.confirmPassword ? "text" : "password"} 
              id="confirm_password" 
              name="confirm_password" 
              placeholder="Confirm Password" 
              required 
              className={styles.largerDots}
            />
            <button 
              type="button" 
              className={styles.togglePassword} 
              onClick={() => togglePasswordVisibility('confirmPassword')}
            >
              {showPassword.confirmPassword ? 
                <img src="/icons/ayclose.png" alt="Hide" className={styles.eyeIcon} /> : 
                <img src="/icons/ay.png" alt="Show" className={styles.eyeIcon} />
              }
            </button>
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Sign In Form - Modified */}
      <div className={`${styles.formContainer} ${styles.signIn}`}>
        <form onSubmit={isAdminLogin ? handleAdminLogin : handleLogin}>
          <h1>{isAdminLogin ? "Sign In as Admin" : "Sign In"}</h1>
          
          {!isAdminLogin && (
            <>
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
            </>
          )}

          <input 
            type="text"
            name="username"
            value={isAdminLogin ? adminCredentials.username : userCredentials.username}
            onChange={isAdminLogin ? handleAdminChange : handleUserChange}
            placeholder={isAdminLogin ? "Admin Username" : "Username"}
            required 
          />
          <div className={styles.passwordWrapper}>
            <input 
              type={isAdminLogin ? (showPassword.adminPassword ? "text" : "password") : (showPassword.userPassword ? "text" : "password")}
              name="password"
              value={isAdminLogin ? adminCredentials.password : userCredentials.password}
              onChange={isAdminLogin ? handleAdminChange : handleUserChange}
              placeholder={isAdminLogin ? "Admin Password" : "Password"}
              required 
              className={styles.largerDots}
            />
            <button 
              type="button" 
              className={styles.togglePassword} 
              onClick={() => togglePasswordVisibility(isAdminLogin ? 'adminPassword' : 'userPassword')}
            >
              {(isAdminLogin ? showPassword.adminPassword : showPassword.userPassword) ? 
                <img src="/icons/ayclose.png" alt="Hide" className={styles.eyeIcon} /> : 
                <img src="/icons/ay.png" alt="Show" className={styles.eyeIcon} />
              }
            </button>
          </div>
          
          {!isAdminLogin && <a href="#">Forget Your Password?</a>}
          
          <button type="submit">
            {isAdminLogin ? "Sign In" : "Sign In"}
          </button>
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