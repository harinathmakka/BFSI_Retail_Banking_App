// File: /home/krishnaprasad/BFSIApp/frontend/src/components/Loan.jsx

import { useState, useEffect } from 'react';
import axios from '../axios';

function Loan() {
  const [loanData, setLoanData] = useState({
    loan_type: '',
    amount: '',
    duration: ''
  });
  const [loans, setLoans] = useState([]);

  const loanOptions = [
    'Home loan',
    'Personal loans',
    'Education loans',
    'Vehicle loans',
    'Gold loan',
    'Business loan',
    'Secured loans'
  ];

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/loan/myloans', {
        headers: { Authorization: token }
      });
      setLoans(res.data.loans);
    } catch (err) {
      console.error('Fetch loan error:', err);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleChange = (e) => {
    setLoanData({ ...loanData, [e.target.name]: e.target.value });
  };

  const applyLoan = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/loan/apply', loanData, {
        headers: { Authorization: token }
      });
      setLoanData({ loan_type: '', amount: '', duration: '' });
      fetchLoans();
    } catch (err) {
      console.error('Apply loan error:', err);
    }
  };

  return (
    <div>
      <h3>Loan Application</h3>
      <form onSubmit={applyLoan}>
        <select
          name="loan_type"
          value={loanData.loan_type}
          onChange={handleChange}
          required
        >
          <option value="">Select Loan Type</option>
          {loanOptions.map((option, idx) => (
            <option key={idx} value={option}>{option}</option>
          ))}
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={loanData.amount}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (months)"
          value={loanData.duration}
          onChange={handleChange}
          required
        />
        <button type="submit">Apply</button>
      </form>

      <h4>My Loan Applications</h4>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Applied On</th>
          </tr>
        </thead>
        <tbody>
          {loans.length === 0 ? (
            <tr><td colSpan="5">No loans</td></tr>
          ) : (
            loans.map((l, i) => (
              <tr key={i}>
                <td>{l.loan_type}</td>
                <td>₹{l.amount.toFixed(2)}</td>
                <td>{l.duration} mo</td>
                <td>{l.status}</td>
                <td>{l.timestamp}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Loan;
