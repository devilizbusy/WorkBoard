import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo('');
    
    try {
      console.log('Attempting login with username:', username);
      const response = await login(username, password); // Call the login function from context
      console.log('Login response:', response);
      
      if (response && response.token) {
        navigate('/boards'); // Redirect to boards on successful login
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'An unexpected error occurred';
      let debugDetails = '';

      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'Login endpoint not found. Please check the API configuration.';
        } else if (err.response.status === 403) {
          errorMessage = 'Authentication failed. Please check your credentials.';
        } else {
          errorMessage = `Server error: ${err.response.status}`;
        }
        debugDetails = `Data: ${JSON.stringify(err.response.data, null, 2)}\nHeaders: ${JSON.stringify(err.response.headers, null, 2)}`;
      } else if (err.request) {
        errorMessage = 'No response received from server';
        debugDetails = `Request: ${JSON.stringify(err.request)}`;
      } else {
        errorMessage = err.message || errorMessage;
        debugDetails = `Error: ${err.toString()}`;
      }

      setError(errorMessage);
      setDebugInfo(debugDetails);
    }
  };

  return (
    <div className="container mx-auto mt-8 max-w-md">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">WorkBoards Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Log in
          </button>
        </form>
      </div>
      {debugInfo && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Debug Info:</h3>
          <div className="bg-white p-2 rounded text-sm overflow-x-auto">
            <pre>{debugInfo}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
