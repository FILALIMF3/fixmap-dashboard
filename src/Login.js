// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';

// Basic styling for the page
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  formContainer: {
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '350px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '24px',
    color: '#1c1e21',
    fontSize: '24px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '6px',
    border: '1px solid #dddfe2',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0062E6', // A nice blue color
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '18px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  }
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // src/Login.js

// ... (keep all the existing code for styles, state, etc.)

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://fixmap-server.onrender.com/api/login', {
        email: email,
        password: password,
      });

      // --- UPDATE THIS PART ---
      // 1. Save the token to the browser's local storage
      localStorage.setItem('token', response.data.token);
      
      // 2. Redirect to the dashboard page
      window.location.href = '/dashboard';
      
    } catch (err) {
      console.error('Login failed:', err.response?.data?.message || 'An error occurred.');
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

// ... (keep the rest of the file the same)
  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>FixMap Dashboard Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={styles.button}>
            Log In
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;