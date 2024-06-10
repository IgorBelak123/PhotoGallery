import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password,
      });
      if (response.data && response.data.message) {
        console.log(response.data.message);
        navigate('/'); // Redirect to home page after successful registration
      } else {
        setErrorMessage('Unexpected response format');
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred');
      console.error(error.response?.data?.error || error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <p>Already have an account? <button onClick={() => navigate('/login')}>Go to Login</button></p>
    </div>
  );
}

export default Register;
