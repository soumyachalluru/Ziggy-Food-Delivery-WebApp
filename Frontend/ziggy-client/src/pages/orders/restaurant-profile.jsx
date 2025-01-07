import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { http } from '../../utils/http';
import { useUserContext } from '../../providers/user-service';

const RestaurantProfile = () => {
  const dishes = useLoaderData();
  const u = useUserContext();

  const [profile, setProfile] = useState({
    name: '',
    location: '',
    description: '',
    contact_info: '',
    timings: '',
    image: null,
  });

  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });
  const [editingDish, setEditingDish] = useState(null); // State for tracking the dish being edited

  // Fetch restaurant profile on mount
  useEffect(() => {
    async function fetchProfile() {
      const { data } = await http.get(`/restaurants/${u.user.role_id}/`);
      setProfile({
        name: data.name,
        location: data.location,
        description: data.description,
        contact_info: data.contact_info,
        timings: data.timings,
        image: null, // Image needs to be re-uploaded if changed
      });
    }
    fetchProfile();
  }, [u.user.role_id]);

  // Handle profile input change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle profile update submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('location', profile.location);
    formData.append('description', profile.description);
    formData.append('contact_info', profile.contact_info);
    formData.append('timings', profile.timings);
    if (profile.image) {
      formData.append('image', profile.image);
    }

    try {
      await http.patch(`/restaurants/${u.user.role_id}/`, formData);
      window.location.reload(); // Reload to reflect updated profile
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  // Handle input change for both adding and editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDish({ ...newDish, [name]: value });
  };

  // Handle form submission for adding new dish
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('restaurant', u.user.role_id);

    if (editingDish) {
      // If editing an existing dish, send PATCH request
      await http.patch(`/dishes/${editingDish.id}/`, formData);
      setEditingDish(null);
    } else {
      // If adding a new dish, send POST request
      await http.post('/dishes/', formData);
    }

    setNewDish({
      name: '',
      description: '',
      price: '',
      image: null,
    });

    window.location.reload(); // Reload to reflect changes
  };

  // Function to load a dish into the form for editing
  const loadDishForEditing = (dish) => {
    setEditingDish(dish); // Set the dish to be edited
    setNewDish({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image: null, // The image should be uploaded again
    });
  };

  // Function to delete a dish
  const deleteDish = async (dishId) => {
    try {
      await http.delete(`/dishes/${dishId}/`); // Send DELETE request to the API
      window.location.reload(); // Reload the page after deletion
    } catch (error) {
      console.error('Failed to delete dish:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans py-12 px-4 md:px-12">
      <h1 className="text-3xl font-bold text-center mb-8">Restaurant Profile</h1>

      {/* Restaurant Profile Update Form */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Update Restaurant Profile</h2>
        <form onSubmit={handleProfileSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              onChange={handleProfileChange}
              value={profile.name}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              onChange={handleProfileChange}
              value={profile.location}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              onChange={handleProfileChange}
              value={profile.description}
              rows="3"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Contact Info</label>
            <input
              type="text"
              name="contact_info"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              onChange={handleProfileChange}
              value={profile.contact_info}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Timings</label>
            <input
              type="text"
              name="timings"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              onChange={handleProfileChange}
              value={profile.timings}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700">Profile Image</label>
            <input
              type="file"
              name="image"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              onChange={(e) => setProfile({ ...profile, image: e.target.files[0] })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
          >
            Update Profile
          </button>
        </form>
      </section>

      <h1 className="text-3xl font-bold text-center mb-8">Your dishes</h1>

      {/* Dishes List */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-3xl mx-auto">
        {dishes.map((dish) => (
          <div key={dish.id} className="mb-4 pb-4 border-b border-gray-200">
            <img
              src={'http://localhost:8000' + dish.image}
              alt={dish.name}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h3 className="text-lg font-semibold">{dish.name}</h3>
            <p className="text-gray-600">{dish.description}</p>
            <p className="text-gray-800 font-bold">${dish.price}</p>

            {/* Edit and Delete Buttons */}
            <button
              onClick={() => loadDishForEditing(dish)}
              className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mt-2 mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => deleteDish(dish.id)}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </section>

      {/* Add or Edit Dish Form */}
      <h2 className="text-2xl text-center font-semibold mb-6 text-gray-800">
        {editingDish ? 'Edit Dish' : 'Add New Dish'}
      </h2>
      <section className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Dish Name */}
          <div className="mb-4">
            <label className="block text-gray-700">Dish Name</label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              onChange={handleChange}
              value={newDish.name}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              onChange={handleChange}
              value={newDish.description}
              rows="3"
              required
            ></textarea>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              step="0.01"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              onChange={handleChange}
              value={newDish.price}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700">Dish Image</label>
            <input
              type="file"
              name="image"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-yellow-500"
              required={!editingDish} // Image is required only when adding a new dish
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
          >
            {editingDish ? 'Update Dish' : 'Add Dish'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default RestaurantProfile;

export async function RestaurantProfileLoader() {
  const { data } = await http.get('/dishes/');
  return data;
}
