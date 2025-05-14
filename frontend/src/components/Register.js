import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state

    try {
      const res =await axios.post('https://cashtrack-6.onrender.com/api/users/register', {
        name,
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', res.data.userEmail);
      localStorage.setItem('username', res.data.username); // Save the name
      navigate('/dashboard');
    } catch (err) {
      setLoading(false); // Hide loading state
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.animatedBackground}>
        {[...Array(15)].map((_, i) => (
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
        <h2 style={styles.title}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>

      {/* Keyframes for Circles Animation */}
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

// Generate random circle styles for animation
const generateCircleStyle = (index) => {
  const size = 30 + (index % 5) * 20; // Size between 30px and 90px
  const top = Math.random() * 100;
  const left = Math.random() * 100;
  const animationDuration = 10 + Math.random() * 10 + 's'; // Random duration between 10s and 20s
  const animationName = index % 2 === 0 ? 'float' : 'float2';

  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${top}%`,
    left: `${left}%`,
    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
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
    backgroundColor: '#ff7f50', // Vibrant coral background
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
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
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
    outline: 'none',
    transition: 'border-color 0.3s ease',
    backgroundColor: '#f9f9f9',
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
    transition: 'background-color 0.3s ease',
    fontSize: '18px',
    height: '55px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '14px',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#444',
    fontSize: '14px',
  },
  link: {
    color: '#4CAF50',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  
  // Responsive design for mobile devices
  '@media (max-width: 768px)': {
    card: {
      padding: '20px',
      maxWidth: '90%',
    },
    title: {
      fontSize: '24px',
    },
    input: {
      padding: '12px',
    },
    button: {
      padding: '12px',
    },
  },
  
  '@media (max-width: 480px)': {
    title: {
      fontSize: '20px',
    },
    input: {
      padding: '10px',
    },
    button: {
      padding: '10px',
    },
    footerText: {
      fontSize: '12px',
    },
  },
};


export default Register;
