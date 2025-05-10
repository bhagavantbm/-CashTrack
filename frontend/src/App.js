// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import AddCustomer from './AddCustomer';
import CustomerSummary from './CustomerSummary';
import Login from './components/Login';
import Register from './components/Register';
import Landing from './components/Landing';
import PrivateRoute from './components/PrivateRoute';
import CustomerTransaction from './CustomerSummary'

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/add-customer" element={<PrivateRoute><AddCustomer /></PrivateRoute>} />
        <Route path="/customer/:id" element={<PrivateRoute><CustomerSummary /></PrivateRoute>} />
        <Route path="/customer/:id" element={<CustomerTransaction />} />

      </Routes>
    </Router>
  );
}

export default App;
