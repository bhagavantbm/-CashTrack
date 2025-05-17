import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
  'http://localhost:4000/api/users/login',
  formData
);


      console.log('Login success:', response.data); // Debug

      const { token, userEmail } = response.data;

      // ✅ Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('email', userEmail);

      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      setError(
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.'
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.footerText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff7f50',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
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
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #4CAF50',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    fontSize: '14px',
  },
  footerText: {
    marginTop: '20px',
    color: '#444',
    fontSize: '14px',
  },
  link: {
    color: '#4CAF50',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
};

export default Login;
