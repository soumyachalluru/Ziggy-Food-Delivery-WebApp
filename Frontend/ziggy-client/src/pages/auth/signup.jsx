// src/pages/SignUp.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../providers/user-service';
import { Button } from '@nextui-org/react';

export function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    address: '',
    phone_number: '', 
  });
  const [isLoading, setIsLoading] = useState(false)
  const u = useUserContext()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    const formData = new FormData(e.target)
    await u.auth(formData, '/customer/signup/')
    setIsLoading(false)    
    navigate('/search', {replace: true})
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
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
          <div className="mb-6">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <Button
            isLoading={isLoading}
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
          >
            Sign Up
          </Button>
        </form>
        <p className="text-gray-600 text-center mt-4">
          Already have an account? <Link to="/log-in" className="text-yellow-500">Login</Link>
        </p>
      </div>
    </div>
  );
};
