import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('email');
    if (!token) navigate('/login');
      
    else {
      setEmail(userEmail || 'user@example.com');
      fetchCustomers();
    }
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('https://cashtrack-6.onrender.com/api/customers', getAuthHeader());
      const sortedCustomers = res.data.sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setCustomers(sortedCustomers);
    } catch {
      // Optionally handle errors
    }
  };

  const calculateCustomerTotals = (transactions = []) => {
    let credit = 0, debit = 0;
    transactions.forEach(txn => {
      if (txn.type === 'credit') credit += txn.amount;
      else if (txn.type === 'debit') debit += txn.amount;
    });
    return { credit, debit, balance: debit-credit };
  };

  const getBalanceText = (credit, debit) => {
    if (credit > debit) {
      return { text: `You need to give ₹${(credit - debit).toLocaleString()}`, type: 'give' };
    } else if (debit > credit) {
      return { text: `You will receive ₹${(debit - credit).toLocaleString()}`, type: 'receive' };
    } else {
      return { text: 'All Settled', type: 'settled' };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      const response = await axios.delete(`https://cashtrack-6.onrender.com/api/customers/${id}`, getAuthHeader());
      if (response.status >= 200 && response.status < 300) {
        alert('Customer deleted!');
        fetchCustomers();
      } catch (err) {
        console.error('Error deleting customer:', err.response?.data || err.message);
      }
    }
  };

  const handleShare = (customer, credit, debit, balance) => {
    const message = `Customer Summary:\nName: ${customer.name}\nPhone: ${customer.phone}\nCredit: ₹${credit}\nDebit: ₹${debit}\nBalance: ₹${balance}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  const grandTotals = customers.reduce(
    (acc, customer) => {
      const { credit, debit, balance } = calculateCustomerTotals(customer.transactions);
      acc.credit += credit;
      acc.debit += debit;
      acc.balance += balance;
      return acc;
    },
    { credit: 0, debit: 0, balance: 0 }
  );

  return (
    <div className="dashboard">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

        .dashboard {
          padding: 24px 16px;
          background: #f9fafc;
          font-family: 'Montserrat', sans-serif;
          min-height: 100vh;
          color: #222;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        h1 {
          font-weight: 700;
          font-size: 2rem;
          color: #2c3e50;
        }

        .profile {
          position: relative;
          cursor: pointer;
        }

        .profile-circle {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #6a11cb, #2575fc);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.3rem;
          user-select: none;
          box-shadow: 0 4px 15px rgba(101, 58, 181, 0.6);
        }

        .dropdown {
          position: absolute;
          top: 54px;
          right: 0;
          background: white;
          box-shadow: 0 8px 30px rgba(101, 58, 181, 0.2);
          border-radius: 10px;
          padding: 14px 20px;
          z-index: 10;
          min-width: 180px;
          text-align: center;
          font-size: 0.9rem;
          color: #333;
        }

        .dropdown p {
          margin: 0 0 14px 0;
          font-weight: 600;
          word-break: break-word;
        }

        .dropdown button {
          background: #8e44ad;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          width: 100%;
          font-size: 0.95rem;
          transition: background 0.3s ease;
        }

        .dropdown button:hover {
          background: #732d91;
        }

        .actions {
          display: flex;
          gap: 14px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .actions button {
          background: linear-gradient(135deg, #2575fc, #6a11cb);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(101, 58, 181, 0.4);
        }

        .actions button:hover {
          background: linear-gradient(135deg, #6a11cb, #2575fc);
        }

        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
        }

        .card {
          background: white;
          padding: 20px 24px;
          border-radius: 16px;
          box-shadow: 0 6px 22px rgba(0,0,0,0.08);
          color: #333;
          transition: transform 0.2s ease;
          cursor: pointer;
        }

        .card:hover {
          transform: translateY(-4px);
        }

        .card h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .card p {
          margin: 4px 0;
          color: #444;
          font-size: 0.95rem;
        }

        .amounts {
          margin-top: 10px;
        }

        .received-money {
          color: #1e8449;
          font-weight: 600;
        }

        .paid-money {
          color: #c0392b;
          font-weight: 600;
        }

        .balance {
          margin-top: 10px;
          font-weight: 700;
          font-size: 1rem;
        }

        .balance.give {
          color: #d35400;
        }

        .balance.receive {
          color: #2e86c1;
        }

        .balance.settled {
          color: #7f8c8d;
        }

        .buttons {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 16px;
        }

        .buttons button {
          flex: 1;
          padding: 8px 12px;
          border: none;
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 8px;
          cursor: pointer;
        }

        .delete-btn {
          background: #ec7063;
          color: white;
        }

        .share-btn {
          background: #5dade2;
          color: white;
        }

        .totals-bar {
          margin-top: 40px;
          background: white;
          padding: 16px;
          border-radius: 14px;
          box-shadow: 0 6px 22px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          font-size: 1rem;
          font-weight: 700;
        }

        .totals-bar span {
          text-align: center;
        }

        .totals-received {
          color: #27ae60;
        }

        .totals-paid {
          color: #e74c3c;
        }

        .totals-balance {
          color: #2980b9;
        }
      `}</style>

      {/* Header */}
      <div className="dashboard-header">
        <h1>CashTrack Dashboard</h1>
        <div className="profile" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="profile-circle">{email.charAt(0).toUpperCase()}</div>
          {showDropdown && (
            <div className="dropdown" onClick={(e) => e.stopPropagation()}>
              <p>{email}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="actions">
        <button onClick={() => navigate('/add-customer')}>Add Customer</button>
      </div>

      {/* Customer Cards */}
      <div className="cards-container">
        {customers.length === 0 && <p>No customers found.</p>}
        {customers.map((customer) => {
          const { credit, debit } = calculateCustomerTotals(customer.transactions);
          const { text, type } = getBalanceText(credit, debit);

          return (
            <div key={customer._id} className="card" onClick={() => navigate(`/customer/${customer._id}`)}>
              <h3>{customer.name}</h3>
              <div className="amounts">
                <p className="credit">Credit: ₹{credit}</p>
                <p className="debit">Debit: ₹{debit}</p>
                <p className="balance">Balance: ₹{balance}</p>
              </div>
              <div className={`balance ${type}`}>{text}</div>
              <div className="buttons" onClick={(e) => e.stopPropagation()}>
                <button className="delete-btn" onClick={() => handleDeleteCustomer(customer._id)}>Delete</button>
                <button className="share-btn" onClick={() => handleShare(customer)}>Share</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals Bar */}
      <div className="totals-bar">
        <span className="totals-received">Total Received: ₹{grandTotals.credit.toLocaleString()}</span>
        <span className="totals-paid">Total Paid: ₹{grandTotals.debit.toLocaleString()}</span>
        <span className="totals-balance">Balance: ₹{grandTotals.balance.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default Dashboard;
