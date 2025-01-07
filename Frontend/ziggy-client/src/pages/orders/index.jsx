import { Chip, Button } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import { http } from '../../utils/http';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../providers/user-service';

export function OrdersPage() {
  const orders = useLoaderData();
  const u = useUserContext();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', address: '' });

  // Fetch profile on component load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await http.get('/customer/profile/');
        setProfile(data);
        setFormData({
          username: data.username,
          email: data.email,
          address: data.address,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await http.put('/customer/profile/', formData);
      setProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans py-12 px-4 md:px-12">
      {/* Customer Profile */}
      {profile && (
        <div className="bg-white shadow rounded-lg p-6 mb-8 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none"
                  value={formData.username}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="bg-yellow-500 text-white">Save Changes</Button>
              <Button type="button" onClick={() => setIsEditing(false)} className="ml-4">Cancel</Button>
            </form>
          ) : (
            <div>
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Address:</strong> {profile.address}</p>
              <Button onClick={() => setIsEditing(true)} className="mt-4 bg-yellow-500 text-white">Edit Profile</Button>
            </div>
          )}
        </div>
      )}

      {/* Orders List */}
      <h1 className="text-3xl font-bold text-center mb-8">Your Orders</h1>
      <section className="rounded-lg p-6 mb-8 max-w-3xl mx-auto">
        {orders.map((order) => (
          <div key={order.id} className="bg-white hover:shadow-lg cursor-pointer mb-4 p-6 rounded-lg border-gray-200" onClick={() => navigate('/orders/' + order.id)}>
            <h3 className="text-lg font-semibold">Order #{order.id}</h3>
            <p className="text-gray-600">{order.items.length} items from {u.user.is_customer ? order.restaurant.name : order.customer.username}, {u.user.is_restaurant && order.delivery_address}</p>
            <Chip className="mt-2">{order.status}</Chip>
          </div>
        ))}
      </section>
    </div>
  );
}

export async function OrdersPageLoader() {
  const { data } = await http.get('/orders/');
  return data;
}
