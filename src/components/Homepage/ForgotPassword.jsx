import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import styles from "./LoginRegister.module.css";

const ForgotPassword = ({ closeModal, goBackToLogin }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const timerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false
  });
  const [otpExpiryTime, setOtpExpiryTime] = useState(null); // OTP expiry time
  const [remainingTime, setRemainingTime] = useState(null);  // Countdown for expiry

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const startCountdown = (expiryTime) => {
    if (timerRef.current) clearInterval(timerRef.current); // clear previous timer
  
    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, expiryTime - Date.now());
      setRemainingTime(remaining);
  
      if (remaining === 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        alert("OTP has expired. Please request a new one.");
      }
    }, 1000);
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Check if email exists in the database
    try {
      const response = await fetch('http://localhost:5000/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
  
      if (result.exists) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otp);
        const Time = Date.now() + 5 * 60 * 1000;
        setOtpExpiryTime(Time);

        const readableTime = new Date(Time).toLocaleTimeString();
  
        const templateParams = {
          user_email: email,
          passcode: otp,
          time: readableTime, 
        };
  
        try {
          await emailjs.send("service_iysc2g7", "template_zywl0ik", templateParams, "c96TY5rqu6knfGW4j");
          alert("OTP sent!");
          startCountdown(Time);
          setOtpSent(true);
          setStep(2);
        } catch (error) {
          console.error("Failed to send OTP", error);
          alert("Failed to send OTP. Please try again.");
        }
      } else {
        alert("Email not found. Please check your email address.");
      }
    } catch (error) {
      console.error("Error checking email:", error);
      alert("Error checking email. Please try again.");
    }
    finally {
      setLoading(false);
    }
  };
  
  const handleVerifyOTP = (e) => {
    e.preventDefault();

    if (remainingTime === 0) {
      alert("OTP has expired. Please request a new one.");
      return;
    }

    if (otp !== generatedOtp) {
      alert("Invalid OTP. Please try again.");
      return;
    }

    alert("OTP verified successfully!");
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: passwords.newPassword }),
      });
  
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const result = await response.json();
  
      if (result.message === 'Password reset successfully!') {
        alert("Your password has been reset successfully.");
        goBackToLogin();
      } else {
        alert("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Error resetting password. Please try again.");
    }
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
            <button type="submit" disabled={loading}>
            {loading ? (
            <div className={styles.loader}></div> // spinner here
            ) : (
            "Send OTP"
            )}
          </button>
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
            {remainingTime !== null && remainingTime > 0 && (
              <div>OTP expires in: {formatTime(remainingTime)}</div>
            )}
            <button type="submit">Verify OTP</button>
            <button 
              type="button" 
              className={styles.resendBtn}
              onClick={handleSendOTP}
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
