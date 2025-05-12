import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('credit');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuthorization = () => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    return token;
  };

  const fetchCustomer = async () => {
    const token = checkAuthorization();
    if (!token) return;

    try {
      const response = await axios.get(`https://cashtrack-6.onrender.com/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomer(response.data);
    } catch {
      setError('Failed to fetch customer details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    const token = checkAuthorization();
    if (!token) return;

    try {
      await axios.post(
        `https://cashtrack-6.onrender.com/api/transactions/${id}`,
        { type, amount: Number(amount), description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAmount('');
      setDescription('');
      fetchCustomer();
    } catch {
      setError('Failed to add transaction.');
    }
  };

  const handleDelete = async (transactionId) => {
    const token = checkAuthorization();
    if (!token) return;

    try {
      await axios.delete(
        `https://cashtrack-6.onrender.com/api/transactions/${id}/${transactionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCustomer();
    } catch {
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

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

  const { credit, debit, balance } = calculateTotals();

  const styles = {
    container: {
      fontFamily: 'Segoe UI, sans-serif',
      padding: '30px',
      maxWidth: '1000px',
      margin: 'auto',
    },
    header: {
      background: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
      padding: '20px',
      color: '#fff',
      borderRadius: '12px',
      textAlign: 'center',
      marginBottom: '30px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
    form: {
      background: '#fff',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '30px',
    },
    input: {
      padding: '12px',
      marginBottom: '12px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      fontSize: '16px',
      width: '100%',
    },
    button: {
      padding: '12px',
      background: '#ff6347',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: '0.3s',
      width: '100%',
    },
    deleteButton: {
      background: '#dc3545',
      padding: '8px 14px',
      borderRadius: '4px',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      transition: '0.3s',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '30px',
    },
    thtd: {
      border: '1px solid #ddd',
      padding: '12px',
      textAlign: 'left',
      backgroundColor: '#f9f9f9',
    },
    summary: {
      padding: '20px',
      background: '#f8f9fa',
      borderRadius: '10px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={styles.container}
    >
      <div style={styles.header}>
        <h2>{customer.name}'s Transaction Dashboard</h2>
        <p>📞 {customer.phone}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={styles.form}
      >
        <h3>Add New Transaction</h3>
        <select value={type} onChange={(e) => setType(e.target.value)} style={styles.input}>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleAddTransaction} style={styles.button}>➕ Add Transaction</button>
      </motion.div>

      <h3 style={{ marginBottom: '10px' }}>Transaction History</h3>
      <div style={{ overflowX: 'auto' }}>
        <motion.table
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={styles.table}
        >
          <thead>
            <tr>
              <th style={styles.thtd}>Type & Date</th>
              <th style={styles.thtd}>Amount</th>
              <th style={styles.thtd}>Description</th>
              <th style={styles.thtd}>Action</th>
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
                    <td style={styles.thtd}>
                      <strong>{txn.type}</strong> <br />
                      <small style={{ color: '#555' }}>{date}</small>
                    </td>
                    <td style={styles.thtd}>₹{txn.amount}</td>
                    <td style={styles.thtd}>{txn.description || 'N/A'}</td>
                    <td style={styles.thtd}>
                      <button
                        onClick={() => handleDelete(txn._id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" style={styles.thtd}>No transactions found.</td>
              </tr>
            )}
          </tbody>
        </motion.table>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={styles.summary}
      >
        <h3>💰 Summary</h3>
        <p><strong>Total Credit:</strong> ₹{credit}</p>
        <p><strong>Total Debit:</strong> ₹{debit}</p>
        <p><strong>Balance:</strong> ₹{balance}</p>
        <button onClick={handleShare} style={styles.button}>
          📤 Share on WhatsApp
        </button>
      </motion.div>
    </motion.div>
  );
};

export default CustomerDetails;
