// frontend/src/components/AllTransactions.jsx
import { useEffect, useState } from 'react';
import axios from '../axios.js';

/**
 * AllTransactions - shows a full table/list of transactions and current balance.
 * Uses GET /account/transactions and expects: { transactions: [...], balance: optional }
 */
function AllTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      // If you have a dedicated /account/info endpoint returning balance+transactions, you can switch the URL.
      const res = await axios.get('/account/transactions', {
        headers: { Authorization: token }
      });
      const txns = res.data.transactions || [];
      setTransactions(txns);

      // If backend sends balance in this endpoint: use it. Otherwise fetch account info separately.
      if (res.data.balance !== undefined) {
        setBalance(res.data.balance);
      } else {
        // try to infer last balance after transaction if provided as balance_after in transaction objects
        const last = txns.length ? txns[0] : null;
        if (last && last.balance_after !== undefined) {
          setBalance(last.balance_after);
        } else {
          setBalance(null);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch transactions');
      console.error('AllTransactions fetch error:', err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>All Transactions</h2>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.balanceCard}>
        <span style={styles.balanceLabel}>Total Balance</span>
        <span style={styles.balanceValue}>
          {balance === null || balance === undefined ? '—' : `₹${Number(balance).toFixed(2)}`}
        </span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Payer</th>
              <th style={styles.th}>Payee</th>
              <th style={styles.th}>Amount (₹)</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.noData}>No transactions found</td>
              </tr>
            ) : (
              transactions.map((t, i) => (
                <tr key={t.id ?? i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={styles.td}>{t.type || '—'}</td>
                  <td style={styles.td}>{t.payer_email || '—'}</td>
                  <td style={styles.td}>{t.payee_email || '—'}</td>
                  <td style={styles.td}>₹{(t.amount ?? 0).toFixed(2)}</td>
                  <td style={styles.td}>{t.description || '—'}</td>
                  <td style={styles.td}>{t.timestamp ? new Date(t.timestamp).toLocaleString() : '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Segoe UI, sans-serif',
    padding: '1.25rem',
    backgroundColor: '#f4f6f8',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.06)',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  title: {
    marginBottom: '1rem',
    color: '#003366',
    textAlign: 'center',
    fontSize: '22px',
    fontWeight: 600
  },
  balanceCard: {
    backgroundColor: '#e9f7ef',
    border: '1px solid #c3e6cb',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  balanceLabel: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#155724'
  },
  balanceValue: {
    fontSize: '18px',
    fontWeight: 800,
    color: '#155724'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff'
  },
  th: {
    padding: '0.75rem',
    textAlign: 'left',
    backgroundColor: '#003366',
    color: '#fff',
    fontWeight: 700,
    position: 'sticky',
    top: 0
  },
  td: {
    padding: '0.6rem',
    color: '#333',
    verticalAlign: 'top'
  },
  rowEven: {
    backgroundColor: '#fbfbfb'
  },
  rowOdd: {
    backgroundColor: '#ffffff'
  },
  noData: {
    padding: '1rem',
    textAlign: 'center',
    color: '#777'
  },
  error: {
    color: '#b00020',
    marginBottom: '0.5rem'
  }
};

export default AllTransactions;
