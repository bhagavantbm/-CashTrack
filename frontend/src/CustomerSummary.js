import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('credit');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomer = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized: No token found');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/api/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomer(response.data);
    } catch (err) {
      setError('Failed to fetch customer details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized: No token found');
      return;
    }

    try {
      await axios.post(`http://localhost:4000/api/transactions/${id}`, {
        type,
        amount: Number(amount),
        description,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setAmount('');
      setDescription('');
      fetchCustomer();
    } catch (err) {
      setError('Failed to add transaction. Please try again.');
    }
  };

  const handleDelete = async (transactionId) => {
    const token = localStorage.getItem('token');
    if (!token) return setError('Unauthorized: No token');

    try {
      await axios.delete(`http://localhost:4000/api/transactions/${id}/${transactionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCustomer();
    } catch (err) {
      setError('Failed to delete transaction.');
    }
  };

  const calculateTotals = () => {
    if (!customer || !Array.isArray(customer.transactions)) return { credit: 0, debit: 0, balance: 0 };
    let credit = 0, debit = 0;
    customer.transactions.forEach((t) => {
      if (t.type === 'credit') credit += t.amount;
      else if (t.type === 'debit') debit += t.amount;
    });
    return { credit, debit, balance: credit - debit };
  };

  const handleShare = () => {
    const { credit, debit, balance } = calculateTotals();
    const message = `Customer Summary for ${customer.name}:\nPhone: ${customer.phone}\nCredit: ₹${credit}\nDebit: ₹${debit}\nBalance: ₹${balance}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  const { credit, debit, balance } = calculateTotals();

  const containerStyle = {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  };

  const inputStyle = {
    padding: '10px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    overflowX: 'auto',
  };

  const thtdStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    textAlign: 'left',
  };

  const summaryBox = {
    marginTop: '20px',
    background: '#f9f9f9',
    padding: '15px',
    borderRadius: '5px',
  };

  const buttonStyle = {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h2>{customer.name}'s Transactions</h2>

      <div style={formStyle}>
        <h3>Add Transaction</h3>
        <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleAddTransaction} style={buttonStyle}>Add Transaction</button>
      </div>

      <h3>Transaction History</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thtdStyle}>Type & Date</th>
              <th style={thtdStyle}>Amount</th>
              <th style={thtdStyle}>Description</th>
              <th style={thtdStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {customer.transactions?.length > 0 ? (
              customer.transactions.map((txn) => {
                const date = new Date(txn.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                });
                return (
                  <tr key={txn._id}>
                    <td style={thtdStyle}>
                      {txn.type} <br /><small style={{ color: 'gray' }}>{date}</small>
                    </td>
                    <td style={thtdStyle}>{txn.amount}</td>
                    <td style={thtdStyle}>{txn.description || 'N/A'}</td>
                    <td style={thtdStyle}>
                      <button onClick={() => handleDelete(txn._id)} style={{ ...buttonStyle, backgroundColor: 'red' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" style={thtdStyle}>No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={summaryBox}>
        <h3>Summary</h3>
        <p><strong>Total Credit:</strong> ₹{credit}</p>
        <p><strong>Total Debit:</strong> ₹{debit}</p>
        <p><strong>Balance:</strong> ₹{balance}</p>
        <button onClick={handleShare} style={buttonStyle}>Share Summary on WhatsApp</button>
      </div>
    </div>
  );
};

export default CustomerDetails;
