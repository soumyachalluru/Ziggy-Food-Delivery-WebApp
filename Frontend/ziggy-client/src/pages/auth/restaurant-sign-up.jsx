// src/pages/RestaurantSignUp.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../providers/user-service';
import { Button } from '@nextui-org/react';

export function RestaurantSignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    location: '',
    description: '',
    contact_info: '',
    images: null, // To handle file uploads
  });
  const [isLoading, setIsLoading] = useState(false)
  const u = useUserContext()
  const navigate = useNavigate()

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    const formData = new FormData(e.target)
    await u.auth(formData, '/restaurant/signup/')
    setIsLoading(false)
    navigate('/', { replace: true })
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Restaurant Sign Up</h1>
        <form onSubmit={handleSubmit}>
          {/* Username */}
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

          {/* Email */}
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

          {/* Password */}
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

          {/* Restaurant Name */}
          <div className="mb-4">
            <label className="block text-gray-700">Restaurant Name</label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
            ></textarea>
          </div>

          {/* Contact Info */}
          <div className="mb-4">
            <label className="block text-gray-700">Contact Info</label>
            <input
              type="text"
              name="contact_info"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              value={formData.contact_info}
              onChange={handleChange}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700">Upload Images</label>
            <input
              type="file"
              name="images"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              onChange={handleFileChange}
              multiple
              required
            />
          </div>

          {/* Submit Button */}
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
}
