// File: /home/krishnaprasad/BFSIApp/frontend/src/pages/VerifyOtp.jsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios.js';

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, otp: serverOtp } = location.state;
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    try {
      await axios.post('/verify-otp', { email, otp });
      alert('OTP Verified. Please login.');
      navigate('/login');
    } catch {
      alert('Invalid OTP');
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <p>Your OTP is: <strong>{serverOtp}</strong></p>
      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}

export default VerifyOtp;
