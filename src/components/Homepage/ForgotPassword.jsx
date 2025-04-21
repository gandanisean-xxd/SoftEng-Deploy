import React, { useState } from "react";
import styles from "./LoginRegister.module.css";

const ForgotPassword = ({ closeModal, goBackToLogin }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
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
    
    // Simulate API call success (replace with actual API call)
    // Show success message instead of immediately returning to login
    setResetSuccess(true);
    setStep(4);
    
    // Automatically return to login after 3 seconds
    setTimeout(() => {
      goBackToLogin();
    }, 3000);
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

        {step === 4 && (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 24 24" width="48" height="48">
                <path 
                  fill="#41AB5D" 
                  d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"
                />
              </svg>
            </div>
            <h2>Success!</h2>
            <p>Your password has been reset successfully.</p>
            <p className={styles.redirectMessage}>You will be redirected to login...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;