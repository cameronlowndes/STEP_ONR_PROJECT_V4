import React, { useState } from 'react';
import { useAuth } from './AuthContext'; // Adjust the import based on your file structure
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    const isValidEmail = /\S+@\S+\.\S+/;
    if (!isValidEmail.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      login({ email: data.email, role: data.role }); // Log the user in
      navigate('/'); // Navigate to the home page or another protected page
    } catch (error) {
      setError(error.message); // Display error message
    }
  };

  const handleAutoLogin = () => {
    // For testing only - ensure this is not used in production
    login({ email: 'admin@example.com', role: 'admin' });
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>} {/* Show error message */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={handleAutoLogin}
            className="mt-4 w-full py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
          >
            Auto Login as Admin
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
