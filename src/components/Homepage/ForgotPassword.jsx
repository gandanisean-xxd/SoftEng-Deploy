import React, { useState } from "react";
import styles from "./LoginRegister.module.css";

const ForgotPassword = ({ closeModal, goBackToLogin }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  
  // Password visibility toggles
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    // TODO: API call to send OTP to email
    console.log("Sending OTP to:", email);
    setOtpSent(true);
    setStep(2);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    // TODO: API call to verify OTP
    console.log("Verifying OTP:", otp);
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    // TODO: API call to reset password
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log("Resetting password", { email, otp, newPassword: passwords.newPassword });
    goBackToLogin(); // Go back to login instead of closing modal
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.modalOverlay} onClick={(e) => {
      // Close when clicking outside the popup
      if (e.target.className === styles.modalOverlay) {
        goBackToLogin();
      }
    }}>
      <div className={styles.forgotPasswordContainer}>
        <button className={styles.backButton} onClick={goBackToLogin}>
          <img 
            src="/icons/close.png" 
            alt="Back" 
            className={styles.backIcon}
          />
        </button>
        
        <h1>Reset Password</h1>
        
        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <p>Enter your email address to receive your OTP</p>
            <input 
              type="email" 
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <button type="submit">Send OTP</button>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <p>We've sent an OTP to your email. Please enter it below.</p>
            <div className={styles.otpMessage}>
              OTP sent to: {email}
            </div>
            <input 
              type="text" 
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required 
              maxLength={6}
              className={styles.otpInput}
            />
            <button type="submit">Verify OTP</button>
            <button 
              type="button" 
              className={styles.resendBtn}
              onClick={() => {
                console.log("Resending OTP to:", email);
                // TODO: API call to resend OTP
              }}
            >
              Resend OTP
            </button>
          </form>
        )}
        
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <p>Create your new password</p>
            
            <div className={styles.passwordWrapper}>
              <input 
                type={showPassword.newPassword ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                required 
                className={styles.largerDots}
              />
              <button 
                type="button" 
                className={styles.togglePassword} 
                onClick={() => togglePasswordVisibility('newPassword')}
              >
                {showPassword.newPassword ? 
                  <img src="/icons/ayclose.png" alt="Hide" className={styles.eyeIcon} /> : 
                  <img src="/icons/ay.png" alt="Show" className={styles.eyeIcon} />
                }
              </button>
            </div>
            
            <div className={styles.passwordWrapper}>
              <input 
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
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
            
            <button type="submit">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;