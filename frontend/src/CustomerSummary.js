// Import statements stay unchanged
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './CustomerDetails.css';
import PaymentIcon from '@mui/icons-material/Payment';
import SmsIcon from '@mui/icons-material/Sms';
import "./styles/CustomerSummary.css"

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
    if (!token) return navigate('/login');
    try {
      const res = await axios.get(`https://cashtrack-6.onrender.com/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomer(res.data);
      setTransactionSettled(false); // reset on refetch
    } catch (err) {
      alert(`Failed to load customer: ${err.message}`);
    } finally {
      setLoading(false);
    }
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

  const handlePhonePePayment = (balance) => {
    alert(`Redirecting to PhonePe to pay ₹${balance}...`);
    setTimeout(() => {
      setTransactionSettled(true);
      fetchCustomer();
    }, 2000);
  };

  const handleSendRequestSMS = (balance, txnId) => {
    const senderUsername = localStorage.getItem('username') || 'CashTrack User';
    const lastTxn = customer.transactions[customer.transactions.length - 1];
    const formattedDate = new Date(lastTxn.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
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

const handlePaidAmount = async () => {
  const parsedPaidAmount = parseFloat(paidAmount);
  
  if (isNaN(parsedPaidAmount) || parsedPaidAmount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  const balance = calculateTotals().balance;

  if (parsedPaidAmount > balance) {
    alert('Paid amount cannot exceed the balance');
    return;
  }

  try {
    // Create a new transaction of type 'debit' (customer paid)
    await axios.post(
      `https://cashtrack-6.onrender.com/api/transactions/${id}`,
      {
        type: 'debit',
        amount: parsedPaidAmount,
        description: `Payment received: ₹${parsedPaidAmount}`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (parsedPaidAmount === balance) {
      alert('Transaction Settled!');
      setTransactionSettled(true);
    } else {
      const remaining = balance - parsedPaidAmount;
      alert(`Partial payment received. ₹${remaining} still due.`);
    }

    setPaidAmount('');
    fetchCustomer();
  } catch (err) {
    alert('Failed to mark payment.');
  }
};


  const addRemainingTransaction = async (remainingBalance) => {
    const txnDescription = `Partial Payment - ₹${remainingBalance} remaining`;
    await axios.post(
      `https://cashtrack-6.onrender.com/api/transactions/${id}`,
      {
        type: 'credit',
        amount: remainingBalance,
        description: txnDescription,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  const calculateTotals = () => {
    let credit = 0, debit = 0;
    if (Array.isArray(customer?.transactions)) {
      customer.transactions.forEach((t) => {
        if (t.type === 'credit') credit += t.amount;
        else debit += t.amount;
      });
    }
    return { credit, debit, balance: credit - debit };
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!customer) return <p className="loading">Customer not found</p>;

  const { credit, debit, balance } = calculateTotals();
  const lastTxn = customer.transactions[customer.transactions.length - 1];

  return (
    <div className="customer-container">
      <div className="customer-card">
        <h2>{customer.name} 💼</h2>
        <p>📱 {customer.phone}</p>
        <p>
          💰 Balance:{' '}
          <span className={balance < 0 ? 'debt' : 'credit'}>₹{Math.abs(balance)}</span>
        </p>
      </div>

      <div className="section">
        <h3>➕ Add Transaction</h3>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="credit">Payment Received</option>
          <option value="debit">Payment Paid</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
        />
        <button onClick={handleAddTransaction} disabled={!amount}>
          Save Transaction
        </button>
      </div>

      <div className="section">
        <h3>📜 Transaction History</h3>
        {customer.transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          [...customer.transactions].reverse().map((txn) => {
            const isLast = txn._id === lastTxn._id;
            return (
              <div key={txn._id} className="txn-card">
                <p>
                  <strong>{txn.type === 'credit' ? 'Received' : 'Paid'}:</strong> ₹{txn.amount}
                </p>
                <p>📅 {new Date(txn.createdAt).toLocaleString()}</p>
                <p>📝 {txn.description || 'No description'}</p>

                {isLast && !transactionSettled && (
                  <div style={{ marginTop: 10 }}>
                    {balance > 0 && (
                      <>
                        <button onClick={() => handlePhonePePayment(balance)} className="pay-btn">
                          <PaymentIcon style={{ fontSize: 18 }} /> Pay ₹{balance}
                        </button>
                        <input
                          type="number"
                          value={paidAmount}
                          onChange={(e) => setPaidAmount(e.target.value)}
                          placeholder="Enter paid amount"
                        />
                        <button onClick={handlePaidAmount} className="paid-btn">
                          Mark as Paid
                        </button>
                      </>
                    )}

                    {balance < 0 && (
                      <button onClick={() => handleSendRequestSMS(balance, txn._id)} className="sms-btn">
                        <SmsIcon style={{ fontSize: 18 }} /> Request Payment
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
