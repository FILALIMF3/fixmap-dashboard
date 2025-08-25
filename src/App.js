// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';

// This is a simple "Protected Route" component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        {/* Redirect base URL to dashboard if logged in, otherwise to login */}
        <Route path="/" element={<Navigate to={localStorage.getItem('token') ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;