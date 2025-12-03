import { useEffect, useState } from 'react';
import axios from '../axios';

function BillPayment() {
  const [billType, setBillType] = useState('Electricity');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [bills, setBills] = useState([]);

  const billTypes = [
    'Electricity',
    'Water',
    'Gas',
    'Internet',
    'Phone',
    'Credit Card',
    'EMI'
  ];

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/bill/mybills', {
        headers: { Authorization: token }
      });
      setBills(res.data);
    } catch (err) {
      console.error('Error fetching bill transactions:', err);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/bill/pay',
        { bill_type: billType, amount },
        { headers: { Authorization: token } }
      );
      setMessage(res.data.message);
      setAmount('');
      fetchBills(); // Refresh transaction log
    } catch (err) {
      console.error('Payment error:', err);
      setMessage('Payment failed. Check balance or inputs.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h3>Bill Payment</h3>
      <form onSubmit={handlePayment} style={{ marginBottom: '1rem' }}>
        <label>Bill Type:</label>
        <select
          value={billType}
          onChange={(e) => setBillType(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        >
          {billTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <button type="submit" style={{ padding: '10px 20px' }}>Pay Bill</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      <h4 style={{ marginTop: '2rem' }}>Bill Payment Transactions</h4>
      {bills.length === 0 ? (
        <p>No bill payments yet.</p>
      ) : (
        <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0' }}>
              <th>Bill Type</th>
              <th>Amount</th>
              <th>Paid On</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill, i) => (
              <tr key={i}>
                <td>{bill.bill_type}</td>
                <td>₹{bill.amount.toFixed(2)}</td>
                <td>{bill.paid_on}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BillPayment;
