// frontend/src/components/BalanceInfo.jsx
import { useEffect, useState } from 'react';
import axios from '../axios.js';

/**
 * BalanceInfo
 * Props:
 *   - reloadFlag (number) : when changed, re-fetches balance (useful after deposits/transfers)
 */
function BalanceInfo({ reloadFlag = 0 }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBalancePrimary = async () => {
    // primary endpoint: /account/balance (added in backend)
    try {
      const res = await axios.get('/account/balance');
      if (res && res.data && typeof res.data.balance !== 'undefined') {
        return { ok: true, balance: res.data.balance };
      }
      return { ok: false, reason: 'no-balance-field' };
    } catch (err) {
      return { ok: false, reason: err };
    }
  };

  const fetchBalanceFallback = async () => {
    // fallback: /account/transactions returns "balance" in our implementation OR we can infer
    try {
      const res = await axios.get('/account/transactions');
      if (res && res.data) {
        if (typeof res.data.balance !== 'undefined') {
          return { ok: true, balance: res.data.balance };
        }
        // attempt to infer from first transaction if it has balance_after
        const txns = res.data.transactions || [];
        if (txns.length && typeof txns[0].balance_after !== 'undefined') {
          return { ok: true, balance: txns[0].balance_after };
        }
      }
      return { ok: false, reason: 'fallback-no-balance' };
    } catch (err) {
      return { ok: false, reason: err };
    }
  };

  const load = async () => {
    setLoading(true);
    setError('');
    // try primary -> fallback
    const primary = await fetchBalancePrimary();
    if (primary.ok) {
      setBalance(primary.balance);
      setLoading(false);
      return;
    }
    const fallback = await fetchBalanceFallback();
    if (fallback.ok) {
      setBalance(fallback.balance);
      setLoading(false);
      return;
    }
    // failed both
    setBalance(0);
    setError('Unable to load balance');
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadFlag]);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Account Balance</h3>

      {loading ? (
        <p style={styles.loading}>Loading balance…</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <p style={styles.balance}>₹{Number(balance ?? 0).toFixed(2)}</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '1rem',
    background: '#fff',
    borderRadius: '8px',
    border: '1px solid #e6e6e6',
    maxWidth: '480px',
    margin: '0 auto'
  },
  title: {
    margin: 0,
    marginBottom: '0.5rem',
    color: '#003366'
  },
  loading: {
    color: '#666'
  },
  error: {
    color: '#b00020'
  },
  balance: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#155724',
    marginTop: '0.5rem'
  }
};

export default BalanceInfo;
