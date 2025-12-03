import { useState } from 'react';
import axios from '../axios.js';

function DepositWithdraw({ onTransaction }) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleTransaction = async (type) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        '/account/transaction',
        {
          amount: parseFloat(amount),
          type
        },
        {
          headers: { Authorization: token }
        }
      );
      setMessage(res.data.message);
      setAmount('');
      onTransaction(); // refresh Transactions
    } catch (err) {
      setMessage(err.response?.data?.error || 'Transaction failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h3>Deposit / Withdraw</h3>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        <button
          style={{ flex: 1, padding: '10px', backgroundColor: '#4caf50', color: '#fff', border: 'none' }}
          onClick={() => handleTransaction('deposit')}
        >
          Deposit
        </button>
        <button
          style={{ flex: 1, padding: '10px', backgroundColor: '#f44336', color: '#fff', border: 'none' }}
          onClick={() => handleTransaction('withdraw')}
        >
          Withdraw
        </button>
      </div>
      {message && <p style={{ marginTop: '10px', color: 'blue' }}>{message}</p>}
    </div>
  );
}

export default DepositWithdraw;
