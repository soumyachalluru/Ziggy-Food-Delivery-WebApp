import { Avatar, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip, useUser } from "@nextui-org/react";

import slide1 from '../assets/slide_1.jpg'
import fastDelivery from '../assets/fast-delivery.jpg'
import wideVariety from '../assets/wide-variety.jpg'
import easyToUse from '../assets/easy-to-use.png'
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../providers/user-service";
import { useState } from "react";
import { IoCart, IoPower } from "react-icons/io5";

export function LandingPage() {
  const u = useUserContext()
  const navigate = useNavigate()
  return (
      <div className="h-screen overflow-auto bg-white font-sans relative">
        {u.user !== null ?
            <div className="flex justify-center items-center gap-4 absolute top-8 right-8 z-50">
              {u.user.is_restaurant && 

              <Tooltip content="profile">
                <Avatar onClick={() => navigate('restaurant-profile')} className="cursor-pointer" />
              </Tooltip>}
              <Tooltip content="Profile & Orders">
                <Button isIconOnly onClick={() => navigate('orders')} className="rounded-full cursor-pointer" >
                  <IoCart />
                </Button>
              </Tooltip> 
              <Tooltip content="logout">
                <Button isIconOnly onClick={() => {u.logout()}} className="rounded-full cursor-pointer" >
                  <IoPower />
                </Button>
              </Tooltip> 
            </div> :
            <Button
            onPress={() => navigate('/log-in')} 
            className="bg-yellow-500 hover:bg-yellow-600 text-white absolute top-8 right-8 z-50 
            font-semibold py-3 px-8 rounded-full transition duration-300">
             Login
            </Button>
        }

        {/* Hero Section */}
        <header className="relative bg-cover bg-center h-screen" style={{ backgroundImage: `url(${slide1})` }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Welcome to Ziggy</h1>
            <p className="text-lg max-w-[30ch] md:text-xl mb-8">Your favorite food, delivered fast and fresh for when you're hangry.</p>
            {(!u.user || (u.user.is_customer)) && <Link to='/search'>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300">
                Order Now
              </button>
            </Link>}
          </div>
        </header>

        {/* App Features Section */}
        <section className="py-16 px-4 md:px-12">
          <h2 className="text-2xl md:text-3xl text-center font-bold mb-8">Why Choose Ziggy?</h2>
          <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
            {[
              { title: 'Fast Delivery', description: 'Get your food in minutes, hot and fresh.', image: fastDelivery },
              { title: 'Wide Variety', description: 'Choose from top restaurants in your area.', image: wideVariety },
              { title: 'Easy to Use', description: 'Simple and intuitive app experience.', image: easyToUse }
            ].map((feature, index) => (
              <div key={index} className="flex-1 h-64 flex flex-col items-center rounded-lg overflow-hidden bg-cover text-center" style={{
                backgroundImage: `url(${feature.image})`
              }}>
                <div className="h-full w-full bg-black bg-opacity-50 flex justify-center items-center flex-col">
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-slate-200">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="text-center flex flex-col gap-1 items-center">
            <p>&copy; {new Date().getFullYear()} Ziggy. All rights reserved.</p>
            <p>Designed with care for foodies everywhere.</p>
            {u.user === null && <Link to="/restaurant-sign-up">
              <button className="hover:bg-yellow-500 hover:bg-opacity-30 text-yellow-500 font-semibold py-2 duration-100 px-6 rounded-full mt-4">
                Add Your Restaurant
              </button>
            </Link>}
          </div>
        </footer>
      </div>
    );
  };