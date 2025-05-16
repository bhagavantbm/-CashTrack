import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'https://cashtrack-6.onrender.com/api/users/register',
        formData
      );

      const { token, userEmail, username } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('username', username || '');

      alert('✅ Registration Successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Registration error:', error);
      alert('❌ Registration failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};

export default Register;
