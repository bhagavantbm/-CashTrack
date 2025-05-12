import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:4000/api/customers',
        formData
      );
      
      setLoading(false);
      navigate('/customers'); // Navigate to the customers list page
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'Failed to add customer');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.animatedBackground}>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.circle,
              ...generateCircleStyle(i),
            }}
          />
        ))}
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Add Customer</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Adding Customer...' : 'Add Customer'}
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes float {
            0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
            50% { transform: translate(30px, 50px) scale(1.3); opacity: 0.5; }
            100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          }

          @keyframes float2 {
            0% { transform: translate(0, 0) scale(1); opacity: 0.9; }
            50% { transform: translate(-50px, 100px) scale(1.5); opacity: 0.6; }
            100% { transform: translate(0, 0) scale(1); opacity: 0.9; }
          }
        `}
      </style>
    </div>
  );
};

const generateCircleStyle = (index) => {
  const size = 30 + (index % 5) * 20;
  const top = Math.random() * 100;
  const left = Math.random() * 100;
  const animationDuration = 10 + Math.random() * 10 + 's';
  const animationName = index % 2 === 0 ? 'float' : 'float2';

  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${top}%`,
    left: `${left}%`,
    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, 0.5)`,
    borderRadius: '50%',
    position: 'absolute',
    animation: `${animationName} ${animationDuration} infinite`,
  };
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6a5acd',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
  },
  animatedBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: '50%',
    animation: 'float 10s ease-in-out infinite',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
    zIndex: 10,
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: '25px',
    color: '#4CAF50',
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  inputGroup: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    padding: '14px',
    border: '2px solid #4CAF50',
    borderRadius: '8px',
    fontSize: '16px',
    color: '#555',
    backgroundColor: '#f9f9f9',
    outline: 'none',
    boxSizing: 'border-box',
    height: '50px',
  },
  button: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    height: '55px',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
    fontSize: '14px',
  },
};

export default AddCustomer;
