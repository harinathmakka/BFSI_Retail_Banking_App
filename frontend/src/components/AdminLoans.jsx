// File: /home/krishnaprasad/BFSIApp/frontend/src/components/AdminLoans.jsx

import { useEffect, useState } from 'react';
import axios from '../axios';

function AdminLoans() {
  const [loans, setLoans] = useState([]);

  const fetchAllLoans = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/loan/admin/all-loans', {
        headers: { Authorization: token }
      });
      setLoans(res.data.loans);
    } catch (err) {
      console.error('Admin loan fetch error:', err);
    }
  };

  const approveLoan = async (loanId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/loan/admin/approve-loan/${loanId}`, {}, {
        headers: { Authorization: token }
      });
      fetchAllLoans();
    } catch (err) {
      console.error('Approve loan error:', err);
    }
  };

  useEffect(() => {
    fetchAllLoans();
  }, []);

  return (
    <div>
      <h3>All Loan Applications (Admin)</h3>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Applied On</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loans.length === 0 ? (
            <tr><td colSpan="8">No loans</td></tr>
          ) : (
            loans.map((l) => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.user_id}</td>
                <td>{l.loan_type}</td>
                <td>₹{l.amount.toFixed(2)}</td>
                <td>{l.duration} mo</td>
                <td>{l.status}</td>
                <td>{l.timestamp}</td>
                <td>
                  {l.status === 'pending' ? (
                    <button onClick={() => approveLoan(l.id)}>Approve</button>
                  ) : '✔️'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminLoans;
