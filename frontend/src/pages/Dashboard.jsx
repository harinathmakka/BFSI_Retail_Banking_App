// frontend/src/pages/Dashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BalanceInfo from '../components/BalanceInfo.jsx';
import DepositWithdraw from '../components/DepositWithdraw.jsx';
import Transactions from '../components/Transactions.jsx';
import FundTransfer from '../components/FundTransfer.jsx';
import LoanService from '../components/Loan.jsx';
import BillPayment from '../components/BillPayment.jsx';
import AllTransactions from '../components/AllTransactions.jsx';
import Support from '../components/Support.jsx';
import Home from '../components/Home.jsx';

function Dashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState('home');
  const [refresh, setRefresh] = useState(0);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleTransaction = () => {
    // bump this to notify children (BalanceInfo, Transactions, AllTransactions) to re-fetch
    setRefresh((prev) => prev + 1);
  };

  const renderSection = () => {
    switch (active) {
      case 'home':
        return <Home />;
      case 'balance':
        // pass refresh so BalanceInfo re-fetches after transactions
        return <BalanceInfo reloadFlag={refresh} />;
      case 'deposit_withdraw':
        return (
          <>
            <DepositWithdraw onTransaction={handleTransaction} />
            <Transactions reloadFlag={refresh} />
          </>
        );
      case 'fund_transfer':
        return (
          <>
            {/* ensure FundTransfer will call onTransferred after a successful transfer */}
            <FundTransfer onTransferred={handleTransaction} />
            <Transactions reloadFlag={refresh} />
          </>
        );
      case 'loan':
        return <LoanService />;
      case 'bill':
        return <BillPayment />;
      case 'transactions':
        // AllTransactions will fetch balance/txns on mount; pass refresh if you want to auto-refresh while open
        return <AllTransactions key={refresh} />;
      case 'support':
        return <Support />;
      default:
        return <p>Select a service above</p>;
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header with title and logout */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2>🏦 BFSI Dashboard</h2>
        <button onClick={logout}>🔒 Logout</button>
      </div>

      {/* Service tab buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActive('home')}>🏠 Home</button>
        <button onClick={() => setActive('balance')}>💰 Balance</button>
        <button onClick={() => setActive('deposit_withdraw')}>💳 Deposit/Withdraw</button>
        <button onClick={() => setActive('fund_transfer')}>🏦 Fund Transfer</button>
        <button onClick={() => setActive('loan')}>🗂️ Loan Services</button>
        <button onClick={() => setActive('bill')}>🧾 Bill Payment</button>
        <button onClick={() => setActive('transactions')}>📋 All Txns</button>
        <button onClick={() => setActive('support')}>🌩️ Support</button>
      </div>

      {/* Section render */}
      <div style={{ borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
        {renderSection()}
      </div>
    </div>
  );
}

export default Dashboard;
