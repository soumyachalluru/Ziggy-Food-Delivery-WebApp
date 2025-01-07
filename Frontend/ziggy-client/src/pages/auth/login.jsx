import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../providers/user-service';
import { Button } from '@nextui-org/react';

export function LogIn() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate();
  const u = useUserContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);

    try {
      await u.auth(formData, '/token/');
      navigate('/', { replace: true });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Set custom error message for invalid credentials
        setErrorMessage("Invalid username or password. Please try again.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p> // Display error message
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="username"
              name="username"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button
            isLoading={isLoading}
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
          >
            Login
          </Button>
        </form>
        <p className="text-gray-600 text-center mt-4">
          Don't have an account? <Link to="/sign-up" className="text-yellow-500">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};
