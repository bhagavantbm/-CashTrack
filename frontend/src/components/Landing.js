import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const isMobile = window.innerWidth < 600;

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #74ebd5, #9face6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      padding: '20px',
    },
    content: {
      background: 'white',
      padding: isMobile ? '20px' : '40px',
      borderRadius: '16px',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      textAlign: 'center',
      width: '100%',
      maxWidth: '400px',
    },
    title: {
      fontSize: isMobile ? '2rem' : '2.5rem',
      marginBottom: '10px',
      color: '#333',
    },
    span: {
      color: '#4a00e0',
    },
    subtitle: {
      fontSize: isMobile ? '0.9rem' : '1rem',
      color: '#555',
      marginBottom: '30px',
    },
    buttons: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'center',
      gap: '20px',
      flexWrap: 'wrap',
    },
    button: {
      padding: '12px 24px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '120px',
    },
    registerBtn: {
      backgroundColor: '#4a00e0',
      color: 'white',
    },
    loginBtn: {
      backgroundColor: 'white',
      color: '#4a00e0',
      border: '2px solid #4a00e0',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>
          Welcome to <span style={styles.span}>CashTrack</span>
        </h1>
        <p style={styles.subtitle}>Your Simple & Smart Transaction Manager</p>
        <div style={styles.buttons}>
          <button
            onClick={() => navigate('/register')}
            style={{ ...styles.button, ...styles.registerBtn }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#3700b3')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#4a00e0')}
          >
            Register
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{ ...styles.button, ...styles.loginBtn }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
            onMouseOut={(e) => (e.target.style.backgroundColor = 'white')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
