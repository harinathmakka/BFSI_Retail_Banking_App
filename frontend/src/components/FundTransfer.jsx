// frontend/src/components/FundTransfer.jsx
import { useState } from 'react';
import axios from '../axios.js';

function FundTransfer({ onTransferred }) {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/account/transfer', {
        recipient_email: email,
        amount: parseFloat(amount)
      }, {
        headers: { Authorization: token }
      });
      setMessage(res.data.message);
      setEmail('');
      setAmount('');
      if (typeof onTransferred === 'function') onTransferred();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Transfer failed');
    }
  };

  return (
    <div>
      <h3>Fund Transfer</h3>
      <form onSubmit={handleTransfer}>
        <input
          type="email"
          placeholder="Recipient Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Transfer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default FundTransfer;
