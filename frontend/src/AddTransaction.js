import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CustomerTransaction = () => {
  const { id } = useParams(); // Get the customer ID from URL
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('credit');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      await axios.post(`http://localhost:4000/api/transactions/${id}`, {
        type,
        amount,
        description
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccessMessage('Transaction added successfully!');
      setAmount('');
      setDescription('');
      setType('credit');

      // Optional delay before navigating
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error('Error adding transaction:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Transaction for Customer {id}</h2>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <label>
          Transaction Type:
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default CustomerTransaction;
