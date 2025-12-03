// frontend/src/components/Transactions.jsx
import { useEffect, useState } from 'react';
import axios from '../axios.js';

/**
 * Recent Transactions panel used inside Dashboard (e.g., Deposit/Withdraw or Fund Transfer sections).
 * Props:
 *   - reloadFlag (number) : when changed, triggers a refresh
 */
function Transactions({ reloadFlag = 0 }) {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/account/transactions', {
        headers: { Authorization: token }
      });
      setTransactions(res.data.transactions || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load transactions');
      setTransactions([]);
      console.error('Transactions fetch error:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadFlag]);

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>Recent Transactions</h4>

      {error && <p style={styles.error}>{error}</p>}

      {transactions.length === 0 ? (
        <p style={styles.noData}>No transactions yet.</p>
      ) : (
        <div style={styles.list}>
          {transactions.slice(0, 8).map((t) => (
            <div key={t.id} style={styles.card}>
              <div style={styles.row}>
                <div style={styles.type}>{t.type || '—'}</div>
                <div style={styles.amount}>₹{(t.amount ?? 0).toFixed(2)}</div>
              </div>

              <div style={styles.rowSmall}>
                <div><strong>Payer:</strong> {t.payer_email || '—'}</div>
                <div><strong>Payee:</strong> {t.payee_email || '—'}</div>
              </div>

              <div style={styles.rowSmall}>
                <div style={styles.timestamp}>
                  {t.timestamp ? new Date(t.timestamp).toLocaleString() : '—'}
                </div>
                {t.description && <div style={styles.desc}><em>{t.description}</em></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: '1rem',
    padding: '0.5rem'
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '18px',
    color: '#003366'
  },
  error: {
    color: '#b00020'
  },
  noData: {
    color: '#666'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '10px',
    background: '#fff'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px'
  },
  rowSmall: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#444',
    marginBottom: '4px'
  },
  type: {
    fontWeight: 600
  },
  amount: {
    fontWeight: 700,
    color: '#155724'
  },
  timestamp: {
    color: '#666',
    fontSize: '12px'
  },
  desc: {
    color: '#333',
    fontSize: '13px'
  }
};

export default Transactions;
