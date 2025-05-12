import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Animated Background Squares */}
      <div style={styles.animatedSquares}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.square,
              ...generateSquareStyle(i),
            }}
          />
        ))}
      </div>

      {/* Content Box */}
      <div style={styles.content}>
        <h1 style={styles.title}>
          Welcome to <span style={styles.highlight}>CashTrack</span>
        </h1>
        <p style={styles.subtitle}>Your Simple & Smart Transaction Manager</p>
        <div style={styles.buttons}>
          <button style={styles.registerBtn} onClick={() => navigate('/register')}>
            Register
          </button>
          <button style={styles.loginBtn} onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </div>

      {/* Keyframes Animation */}
      <style>
        {`
          @keyframes move {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            50% { transform: translate(50px, -50px) rotate(180deg); opacity: 0.6; }
            100% { transform: translate(0, 0) rotate(360deg); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

// Dynamic square generator
const generateSquareStyle = (index) => {
  const colors = ['#4a00e0', '#00bcd4', '#ff4d6a', '#00ffcc', '#ffbb00', '#e91e63'];
  const size = 40 + (index % 4) * 10; // size between 40px - 70px
  const top = Math.random() * 100;
  const left = Math.random() * 100;
  const delay = (index % 6) + 's';

  return {
    backgroundColor: colors[index % colors.length],
    width: `${size}px`,
    height: `${size}px`,
    top: `${top}%`,
    left: `${left}%`,
    animationDelay: delay,
  };
};

const styles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #74ebd5, #9face6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Segoe UI, sans-serif',
    overflow: 'hidden',
    padding: '20px',
  },
  content: {
    background: '#fff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    zIndex: 10,
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    color: '#333',
  },
  highlight: {
    color: '#4a00e0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '30px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  registerBtn: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#4a00e0',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
  },
  loginBtn: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: 'white',
    color: '#4a00e0',
    border: '2px solid #4a00e0',
    borderRadius: '25px',
    cursor: 'pointer',
  },
  animatedSquares: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  square: {
    position: 'absolute',
    borderRadius: '10px',
    animation: 'move 8s ease-in-out infinite',
    opacity: 0.6,
  },
};

export default Landing;
