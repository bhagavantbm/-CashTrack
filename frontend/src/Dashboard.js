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
    if (!token) {
      navigate('/login');
    } else {
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
      const res = await axios.get('http://localhost:4000/api/customers', getAuthHeader());
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err.response?.data || err.message);
    }
  };

 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const calculateCustomerTotals = (transactions = []) => {
    let credit = 0, debit = 0;
    transactions.forEach(txn => {
      if (txn.type === 'credit') credit += txn.amount;
      else if (txn.type === 'debit') debit += txn.amount;
    });
    return { credit, debit, balance: credit - debit };
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:4000/api/customers/${id}`, getAuthHeader());
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
    <div className="dashboard-container">
      <style>{`
        .dashboard-container {
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
          background: #f9f9f9;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .profile-wrapper {
          position: relative;
          cursor: pointer;
        }
        .profile-circle {
          width: 40px;
          height: 40px;
          background-color: #007bff;
          border-radius: 50%;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          overflow: hidden;
        }
        .profile-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .dropdown-menu {
          position: absolute;
          top: 50px;
          right: 0;
          background: white;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 10;
        }
        .dropdown-menu p {
          margin: 0 0 8px 0;
          font-weight: bold;
        }
        .dropdown-menu button {
          background-color: red;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        }
        .actions {
          margin: 20px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .actions button {
          padding: 10px 14px;
          border: none;
          background-color: #007bff;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
        .customer-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          box-shadow: 0 0 8px rgba(0,0,0,0.05);
        }
        .customer-table th, .customer-table td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        .customer-table th {
          background-color: #007bff;
          color: white;
        }
        .customer-table td button {
          margin-right: 6px;
          padding: 4px 8px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
        }
        .customer-table td button:first-child {
          background-color: #ff4d4d;
          color: white;
        }
        .customer-table td button:last-child {
          background-color: #28a745;
          color: white;
        }

        @media (max-width: 768px) {
          .customer-table thead {
            display: none;
          }
          .customer-table, .customer-table tbody, .customer-table tr, .customer-table td {
            display: block;
            width: 100%;
          }
          .customer-table tr {
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 6px;
            background: #fff;
            padding: 10px;
          }
          .customer-table td {
            padding: 8px 10px;
            text-align: left;
            border: none;
          }
          .customer-table td[data-label="Phone"],
          .customer-table td[data-label="Credit"],
          .customer-table td[data-label="Debit"],
          .customer-table td[data-label="Actions"] {
            display: none;
          }
        }
      `}</style>

      <div className="dashboard-header">
        <h2>Customer Dashboard</h2>
        <div className="profile-wrapper" onClick={toggleDropdown}>
          <div className="profile-circle">
            {profilePic ? (
              <img src={profilePic} alt="Profile" />
            ) : (
              email.charAt(0).toUpperCase()
            )}
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              <p>{email}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="actions">
        <button onClick={() => navigate('/add-customer')}>Add Customer</button>
        <button onClick={fetchCustomers}>Refresh Data</button>
      </div>

      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Credit (₹)</th>
            <th>Debit (₹)</th>
            <th>Balance (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => {
            const { credit, debit, balance } = calculateCustomerTotals(customer.transactions);
            return (
              <tr key={customer._id}>
                <td data-label="Name" onClick={() => navigate(`/customer/${customer._id}`)} style={{ cursor: 'pointer' }}>{customer.name}</td>
                <td data-label="Phone">{customer.phone}</td>
                <td data-label="Credit">₹{credit}</td>
                <td data-label="Debit">₹{debit}</td>
                <td data-label="Balance">₹{balance}</td>
                <td data-label="Actions">
                  <button onClick={() => handleDeleteCustomer(customer._id)}>Delete</button>
                  <button onClick={() => handleShare(customer, credit, debit, balance)}>Share</button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="2">Total</th>
            <th>₹{grandTotals.credit}</th>
            <th>₹{grandTotals.debit}</th>
            <th>₹{grandTotals.balance}</th>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Dashboard;
