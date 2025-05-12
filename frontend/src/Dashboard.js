import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState('');
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
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err.response?.data || err.message);
    }
  };

  const calculateCustomerTotals = (transactions = []) => {
    let credit = 0, debit = 0;
    transactions.forEach(txn => {
      if (txn.type === 'credit') credit += txn.amount;
      else if (txn.type === 'debit') debit += txn.amount;
    });
    return { credit, debit, balance: credit - debit };
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`https://cashtrack-6.onrender.com/api/customers/${id}`, getAuthHeader());
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
        .dashboard {
          padding: 20px;
          background: #f0f4f8;
          font-family: 'Segoe UI', sans-serif;
          min-height: 100vh;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .profile {
          position: relative;
          cursor: pointer;
        }

        .profile-circle {
          width: 40px;
          height: 40px;
          background: #007bff;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          background: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          border-radius: 6px;
          padding: 10px;
          z-index: 5;
          animation: fadeIn 0.3s ease-in-out;
        }

        .dropdown button {
          background: red;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .dropdown button:hover {
          background: darkred;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .actions button {
          background: #28a745;
          color: white;
          border: none;
          padding: 10px 14px;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .actions button:hover {
          background: #218838;
          transform: scale(1.03);
        }

        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .card {
          background: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
          transition: 0.3s;
          cursor: pointer;
          animation: cardFadeIn 0.6s ease both;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }

        .card h3 {
          margin: 0 0 8px;
          color: #333;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .card .amounts {
          margin: 10px 0;
        }

        .card .amounts p {
          margin: 4px 0;
        }

        .credit { color: green; }
        .debit { color: red; }
        .balance { font-weight: bold; }

        .card .buttons {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .card .buttons button {
          flex: 1;
          border: none;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .delete-btn {
          background: #dc3545;
          color: white;
        }

        .delete-btn:hover {
          background: #c82333;
          transform: scale(1.05);
        }

        .share-btn {
          background: #007bff;
          color: white;
        }

        .share-btn:hover {
          background: #0056b3;
          transform: scale(1.05);
        }

        .totals-bar {
          margin-top: 40px;
          padding: 20px;
          background: linear-gradient(135deg, #ffe259, #ffa751);
          color: #333;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          font-size: 1.1rem;
          text-align: center;
          line-height: 1.6;
          font-weight: 600;
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 10px;
          animation: fadeIn 0.8s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes cardFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 600px) {
          .dashboard-header h2 {
            font-size: 1.2rem;
          }

          .totals-bar {
            flex-direction: column;
            align-items: center;
            text-align: left;
          }
        }
      `}</style>

      <div className="dashboard-header">
        <h2>📋 Customer Dashboard</h2>
        <div className="profile" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="profile-circle">
            {profilePic ? <img src={profilePic} alt="profile" /> : email[0]?.toUpperCase()}
          </div>
          {showDropdown && (
            <div className="dropdown">
              <p>{email}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="actions">
        <button onClick={() => navigate('/add-customer')}>➕ Add Customer</button>
        <button onClick={fetchCustomers}>🔄 Refresh</button>
      </div>

      <div className="cards-container">
        {customers.map(customer => {
          const { credit, debit, balance } = calculateCustomerTotals(customer.transactions);
          return (
            <div
              className="card"
              key={customer._id}
              onClick={() => navigate(`/customer/${customer._id}`)}
            >
              <h3>{customer.name}</h3>
              <p style={{ color: '#777' }}>📞 {customer.phone}</p>
              <div className="amounts">
                <p className="credit">Credit: ₹{credit}</p>
                <p className="debit">Debit: ₹{debit}</p>
                <p className="balance">Balance: ₹{balance}</p>
              </div>
              <div className="buttons">
                <button
                  className="delete-btn"
                  onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(customer._id); }}
                >
                  Delete
                </button>
                <button
                  className="share-btn"
                  onClick={(e) => { e.stopPropagation(); handleShare(customer, credit, debit, balance); }}
                >
                  Share
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="totals-bar">
        <span>🟢 Credit: ₹{grandTotals.credit}</span>
        <span>🔴 Debit: ₹{grandTotals.debit}</span>
        <span>⚖️ Balance: ₹{grandTotals.balance}</span>
      </div>
    </div>
  );
};

export default Dashboard;
