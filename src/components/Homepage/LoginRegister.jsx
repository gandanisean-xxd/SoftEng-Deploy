import React, { useState } from "react";
import styles from "./LoginRegister.module.css";
import ForgotPassword from "./ForgotPassword";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";


const LoginRegister = ({ closeModal }) => {
  const [isActive, setIsActive] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');  
  const navigate = useNavigate();
  
  // Separate states for admin and regular login
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });
  
  const [userCredentials, setUserCredentials] = useState({
    email:'',
    password: '',
    role: ''
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
    axios.post('http://localhost:5000/login', userCredentials)
      .then(result => {
        console.log(result);
        if (result.data === "Success") {
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("userEmail", userCredentials.email);
          navigate('/map');
        }
      })
      .catch(err => console.log("Login error:", err));
  };

  const handleRegister = (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    const userData = {
      email,
      password,
      role
    };
  
    axios.post('http://localhost:5000/register', userData)
      .then(result => {
        console.log("Register result:", result.data);
        alert("Registration successful!");
        navigate('/');
      })
      .catch(err => console.log("Register error:", err));
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

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  return (
    <>
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
        <span className={styles.adminLabel}>Admin</span>
      </button>

        {/* Sign Up Form */}
        <div className={`${styles.formContainer} ${styles.signUp}`}>
          <form onSubmit={handleRegister}>
            <h1>Create Account</h1>
            <button type="button" className={styles.googleBtn}>
            <GoogleLogin
                  onSuccess={credentialResponse => {
                    const credentialResponseDecoded = jwtDecode(
                    credentialResponse.credential
                    );
                    fetch("http://localhost:5000/auth/google", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify(credentialResponseDecoded)
                    })
                    .then(res => res.json())
                    .then(data => {
                      console.log("User saved or found:", data);
                    })
                    .catch(err => {
                      console.error("Error saving Google user:", err);
                    });                    
                    console.log(credentialResponseDecoded);
                    navigate('/map');
                  }}
                  onError={() => {
                    console.log('Google Sign Up failed');
                  }}
                  render={renderProps => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    type="button"
                    className={`${styles.googleBtn} ${styles.customGoogle}`}
                  >
                  <img 
                    src="/icons/google.webp" 
                    alt="Google logo" 
                    className={styles.googleIcon}
                  />
                  Sign up with Google
                </button>
              )}
            />
            </button>
            <div className={styles.divider}>
              <span>OR</span>
            </div>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email}
              placeholder="Email Address" 
              onChange={(e) => setEmail(e.target.value)}
              required 
            />

            <div className={styles.passwordWrapper}>
              <input 
                type={showPassword.registerPassword ? "text" : "password"} 
                id="password" 
                name="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            
            {/* New Role Dropdown */}
              <div className={styles.selectWrapper}>
                <select 
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={styles.roleSelect}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Urban Planner">Urban Planner</option>
                  <option value="Student">Student</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Others">Others</option>
                </select>
                <div className={styles.dropdownIcon}>
                  <img src="/icons/dropdown0.png" alt="Dropdown arrow" />
                </div>
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
                <GoogleLogin
                  onSuccess={credentialResponse => {
                    const credentialResponseDecoded = jwtDecode(
                    credentialResponse.credential
                    );
                    console.log(credentialResponseDecoded);
                    navigate('/map');
                  }}
                  onError={() => {
                    console.log('Google Sign Up failed');
                  }}
                  render={renderProps => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    type="button"
                    className={`${styles.googleBtn} ${styles.customGoogle}`}
                  >
                  <img 
                    src="/icons/google.webp" 
                    alt="Google logo" 
                    className={styles.googleIcon}
                  />
                  Sign up with Google
                </button>
              )}
            />
            </button>
                <div className={styles.divider}>
                  <span>OR</span>
                </div>
              </>
            )}

            {isAdminLogin ? (
              <input 
                type="text"
                name="username"
                value={adminCredentials.username}
                onChange={handleAdminChange}
                placeholder="Admin Username"
                required 
              />
            ) : (
              <input 
                type="email"
                name="email"
                value={userCredentials.email}
                onChange={handleUserChange}
                placeholder="Email Address"
                required 
              />
            )}


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
            
            {!isAdminLogin && (
              <a href="#" onClick={(e) => {
                e.preventDefault();
                handleForgotPassword();
              }}>
                Forgot your password?
              </a>
            )}
            
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
      
      {/* Render Forgot Password as overlay */}
      {showForgotPassword && (
        <ForgotPassword 
          closeModal={closeModal} 
          goBackToLogin={handleBackToLogin} 
        />
      )}
    </>
  );
};

export default LoginRegister;