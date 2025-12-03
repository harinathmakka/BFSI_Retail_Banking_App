// File: frontend/src/components/Home.jsx

function Home() {
  return (
    <div className="home-wrapper">
      <div className="home-container">
        <h2>Welcome to <span className="highlight">BFSI Retail Banking App</span></h2>
        <p className="intro-text">
          Your one-stop secure digital platform for banking, financial, and insurance services.
        </p>
        <ul className="service-list">
          <li>💰 <strong>Real-Time Balance:</strong> Instantly view your available balance.</li>
          <li>💵 <strong>Deposit & Withdraw:</strong> Secure cash transactions anytime.</li>
          <li>🔁 <strong>Fund Transfer:</strong> Send money to others in seconds.</li>
          <li>📄 <strong>Transaction Logs:</strong> Monitor all your financial activities.</li>
          <li>🏦 <strong>Loan Services:</strong> Apply for Home, Education, or Personal Loans.</li>
          <li>📅 <strong>Bill Payments:</strong> Pay utility bills directly from your account.</li>
          <li>📩 <strong>Customer Support:</strong> We're here for your banking needs.</li>
        </ul>
        <p className="final-text">
          Experience secure, transparent, and user-first banking services 24/7.
        </p>
      </div>
    </div>
  );
}

export default Home;
