// File: /home/krishnaprasad/BFSIApp/frontend/src/components/Support.jsx
import { useState, useEffect } from 'react';
import axios from '../axios.js';

function Support() {
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchTickets = async () => {
    try {
      const res = await axios.get('/support/mytickets');
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setTickets([]);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const submitTicket = async () => {
    try {
      if (!message.trim()) {
        setStatusMsg('Please enter a message.');
        return;
      }
      const res = await axios.post('/support/submit', { message: message.trim() });
      setStatusMsg(res.data.message || 'Submitted');
      setMessage('');
      fetchTickets();
    } catch (err) {
      console.error('Error submitting support ticket:', err);
      const errMsg = err.response?.data?.error || 'Submission failed';
      setStatusMsg(errMsg);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h3>Customer Support</h3>

      <textarea
        rows="4"
        cols="50"
        placeholder="Enter your complaint or query"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />
      <br />
      <button onClick={submitTicket} style={{ padding: '8px 16px' }}>Submit</button>

      {statusMsg && <p style={{ marginTop: '8px', color: '#155724' }}>{statusMsg}</p>}

      <h4 style={{ marginTop: '1.5rem' }}>Support History</h4>
      {tickets.length === 0 ? (
        <p>No support tickets yet.</p>
      ) : (
        <ul>
          {tickets.map((t) => (
            <li key={t.id} style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>{new Date(t.created_at).toLocaleString()}</div>
              <div>{t.message}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Support;
