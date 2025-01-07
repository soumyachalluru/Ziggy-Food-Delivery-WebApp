// src/pages/SearchPage.js

import { Card, CardFooter, User, useNavbar } from '@nextui-org/react';
import React, { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { http } from '../../utils/http';
import fallback from '../../assets/fallback-res-image.png';

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const restaurants = useLoaderData(); 
  const navigate = useNavigate();

  const filteredResults = restaurants.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Search Bar */}
      <section className="bg-white shadow-lg py-8 px-4 md:px-12">
        <h1 className="text-3xl font-bold text-center mb-6">Search for Restaurants</h1>
        <div className="flex justify-center items-center">
          <input
            type="text"
            placeholder="Search for restaurants..."
            className="border border-gray-300 rounded-full py-2 px-4 w-full max-w-md focus:outline-none focus:border-yellow-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Restaurant Cards */}
      <section className="py-12 px-4 md:px-12">
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResults.map(result => (
              <Card
                shadow="none"
                key={result.id}
                isPressable
                onPress={() => navigate('/restaurants/' + result.id)}
                radius="lg"
                className="border-none hover:scale-[1.02] shadow-md transition-all duration-100 hover:shadow-lg"
              >
                <div
                  className={`aspect-[2.3] w-full bg-no-repeat bg-center ${result.images ? 'bg-cover' : 'bg-contain'}`}
                  style={{
                    backgroundImage: `url(${result.images ? 'http://localhost:8000/media/' + result.images : fallback})`
                  }}
                />
                <CardFooter className="justify-between shadow-medium overflow-hidden z-10">
                  <User name={result.name} description={result.description} avatarProps={{ className: 'hidden' }} />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-12">No results found. Try a different search term.</p>
        )}
      </section>
    </div>
  );
};

export async function SearchPageLoader() {
  const { data } = await http.get('/restaurants');
  return data;
}
