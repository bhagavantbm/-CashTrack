import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddCustomer = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      navigate('/login');
      return;
    }

    // Simple phone number validation (can be expanded)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    setError(null); // Reset error state on submit

    try {
      const response = await axios.post(
        'https://cashtrack-6.onrender.com/api/customers',
        { name, phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Customer added:', response.data);
      setName('');
      setPhone('');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding customer:', error.response ? error.response.data : error);
      setError('Failed to add customer. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to right, #FF7E5F, #FEB47B)', // Stylish gradient background
      fontFamily: 'Poppins, sans-serif', // Attractive font
      padding: '20px',
    },
    form: {
      backgroundColor: '#fff',
      padding: '40px 30px',
      borderRadius: '12px',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)', // Soft shadow for depth
      width: '100%',
      maxWidth: '450px',
      transition: 'all 0.3s ease',
    },
    title: {
      marginBottom: '20px',
      fontSize: '28px',
      fontWeight: '600',
      textAlign: 'center',
      color: '#333',
      letterSpacing: '1px',
    },
    input: {
      width: '100%',
      padding: '15px',
      marginBottom: '20px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '16px',
      transition: '0.3s ease', // Smooth focus transitions
    },
    inputFocus: {
      borderColor: '#FF7E5F', // Focus color on input
      boxShadow: '0 0 10px rgba(255, 126, 95, 0.6)',
    },
    button: {
      width: '100%',
      padding: '15px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#FF7E5F',
      color: '#fff',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#D76B5A',
    },
    error: {
      color: '#D9534F',
      marginBottom: '10px',
      textAlign: 'center',
      fontSize: '14px',
    },
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = styles.inputFocus.borderColor;
    e.target.style.boxShadow = styles.inputFocus.boxShadow;
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#ddd';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Add Customer</h2>
        {error && <div style={styles.error}>{error}</div>}
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={styles.input}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: loading ? '#999' : styles.button.backgroundColor,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          {loading ? 'Adding...' : 'Add Customer'}
        </button>
      </form>
    </div>
  );
};

export default AddCustomer;
