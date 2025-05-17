import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import PaymentIcon from '@mui/icons-material/Payment';
import SmsIcon from '@mui/icons-material/Sms';

import './styles/CustomerSummary.css';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('credit');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [paidAmount, setPaidAmount] = useState('');
  const [transactionSettled, setTransactionSettled] = useState(false);
  const [requestCounts, setRequestCounts] = useState({});
  const token = localStorage.getItem('token');

  const fetchCustomer = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await axios.get(`https://cashtrack-6.onrender.com/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomer(res.data);
      setTransactionSettled(false); // Reset on refetch
    } catch (err) {
      alert(`Failed to load customer: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const calculateTotals = () => {
    let credit = 0,
      debit = 0;
    if (Array.isArray(customer?.transactions)) {
      customer.transactions.forEach((t) => {
        if (t.type === 'credit') credit += t.amount;
        else debit += t.amount;
      });
    }
    return { credit, debit, balance: credit - debit };
  };

  const handleAddTransaction = async () => {
    if (!token) return navigate('/login');
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    try {
      await axios.post(
        `https://cashtrack-6.onrender.com/api/transactions/${id}`,
        { type, amount: parsedAmount, description: description.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAmount('');
      setDescription('');
      fetchCustomer();
    } catch {
      alert('Error adding transaction');
    }
  };

  const handlePaidAmount = async () => {
    if (!token) return navigate('/login');
    const parsedPaidAmount = parseFloat(paidAmount);
    if (isNaN(parsedPaidAmount) || parsedPaidAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    const { balance } = calculateTotals();
    if (parsedPaidAmount > balance) {
      alert('Paid amount cannot exceed the balance');
      return;
    }

    try {
      await axios.post(
        `https://cashtrack-6.onrender.com/api/transactions/${id}`,
        {
          type: 'debit',
          amount: parsedPaidAmount,
          description: `Payment received: ₹${parsedPaidAmount}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (parsedPaidAmount === balance) {
        alert('Transaction Settled!');
        setTransactionSettled(true);
      } else {
        alert(`Partial payment received. ₹${balance - parsedPaidAmount} still due.`);
      }
      setPaidAmount('');
      fetchCustomer();
    } catch (err) {
      alert('Failed to mark payment.');
    }
  };

  const handlePhonePePayment = async (balance) => {
    const input = prompt(`Customer owes ₹${balance}. Enter amount to pay:`);

    const paidAmount = parseFloat(input);
    if (isNaN(paidAmount) || paidAmount <= 0) {
      alert('Invalid amount');
      return;
    }
    if (paidAmount > balance) {
      alert('Paid amount cannot be greater than balance');
      return;
    }
    try {
      await axios.post(
        `https://cashtrack-6.onrender.com/api/transactions/${id}`,
        {
          type: 'debit',
          amount: paidAmount,
          description: `Paid ₹${paidAmount} via PhonePe`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const upiId = 'yourupi@okaxis'; // Replace with your UPI ID
      const name = encodeURIComponent('CashTrack');
      const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${paidAmount}&cu=INR`;

      window.location.href = upiUrl;

      fetchCustomer();
    } catch (error) {
      alert('Failed to record payment');
    }
  };

  const handleSendRequestSMS = (balance, txnId) => {
    const senderUsername = localStorage.getItem('username') || 'CashTrack User';
    const lastTxn = customer.transactions[customer.transactions.length - 1];
    const formattedDate = new Date(lastTxn.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const message = `Hello ${customer.name}, 👋

This is a reminder from ${senderUsername}.

📊 Balance: ₹${Math.abs(balance)}
📝 Last transaction: "${lastTxn.description || 'No description'}" on ${formattedDate}

Please pay ₹${Math.abs(balance)} to ${senderUsername} at your earliest convenience. Thank you! 🙏`;

    window.location.href = `sms:${customer.phone}?body=${encodeURIComponent(message)}`;

    setRequestCounts((prev) => ({
      ...prev,
      [txnId]: (prev[txnId] || 0) + 1,
    }));
  };

  if (loading) return <p className="center-text">Loading...</p>;
  if (!customer) return <p className="center-text">Customer not found</p>;

  const { credit, debit, balance } = calculateTotals();

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">{customer.name} 💼</h2>
        <p className="info">📱 {customer.phone}</p>
        <p className="balance">
          💰 Balance:{' '}
          <span className={balance < 0 ? 'negative' : 'positive'}>₹{balance}</span>
        </p>
      </div>

      <div className="section">
        <h3 className="section-title">➕ Add Transaction</h3>

        <form
          className="transaction-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTransaction();
          }}
          noValidate
        >
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Transaction Type"
          >
            <option value="credit">Payment Received</option>
            <option value="debit">Payment Paid</option>
          </select>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            min="0"
          />

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
          />

          <button
            type="submit"
            disabled={!amount}
            className={!amount ? 'btn-disabled' : 'btn-primary'}
          >
            Save Transaction
          </button>
        </form>
      </div>

      <div className="section">
        <h3 className="section-title">📜 Transaction History</h3>
        {customer.transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          customer.transactions
            .slice()
            .reverse()
            .map((txn, index) => {
              const isLast = index === 0; // reversed, so first is latest
              return (
                <div key={txn._id} className="txn-card">
                  <p>
                    <strong>{txn.type === 'credit' ? 'Received' : 'Paid'}:</strong> ₹{txn.amount}
                  </p>
                  <p>📅 {new Date(txn.createdAt).toLocaleString()}</p>
                  <p>📝 {txn.description || 'No description'}</p>

                  {isLast && !transactionSettled && (
                    <div className="txn-actions">
                      {balance > 0 && (
                        <>
                          <button
                            onClick={() => handlePhonePePayment(balance)}
                            className="pay-button"
                          >
                            <PaymentIcon style={{ fontSize: 18, marginRight: 5 }} /> Pay ₹{balance}
                          </button>

                          <input
                            type="number"
                            value={paidAmount}
                            onChange={(e) => setPaidAmount(e.target.value)}
                            placeholder="Enter paid amount"
                            min="0"
                            style={{ marginLeft: 10 }}
                          />
                          <button onClick={handlePaidAmount} className="paid-button">
                            Mark as Paid
                          </button>
                        </>
                      )}

                      {balance <= 0 && (
                        <button
                          onClick={() => handleSendRequestSMS(balance, txn._id)}
                          className="sms-button"
                        >
                          <SmsIcon style={{ fontSize: 18, marginRight: 5 }} /> Request Payment
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;
