import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const [message, setMessage] = useState('Logging out...');
  const navigate = useNavigate();

  useEffect(() => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Set a success message for logout
    setMessage('Logged out successfully! Redirecting to login...');
    
    // After 2 seconds, redirect to login page
    setTimeout(() => {
      navigate('/login');
    }, 2000); // Redirect after 2 seconds
  }, [navigate]);

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
}
