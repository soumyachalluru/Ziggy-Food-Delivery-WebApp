import { Button, Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/react';
import React, { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { DishCard } from '../../components/dish-card';
import { CartAlreadyExistsError, useCartContext } from '../../providers/cart-service';
import { http } from '../../utils/http';
import { FaArrowRight } from 'react-icons/fa';

export function RestaurantPage() {
  const restaurant = useLoaderData();
  const cart = useCartContext();
  const [error, setError] = useState(null);

  function handleAdd(dish) {
    try {
      cart.addItem(restaurant, dish);
    } catch (err) {
      if (err instanceof CartAlreadyExistsError) setError(err);
      else console.error(err);
    }
  }

  function handleReplace(dish) {
    cart.replace(restaurant, dish);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans overflow-auto">
      <Modal isOpen={!!error}>
        <ModalContent>
          <ModalBody className="p-8">
            <p className="text-2xl">
              You already have a cart with {cart.items.length} item(s) from {error?.restaurant.name}. Do you wish to replace?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button className="border-2 border-yellow-500 bg-transparent" onPress={() => setError(null)}>
              Cancel
            </Button>
            <Button className="bg-yellow-500 font-bold hover:bg-yellow-400" onPress={() => handleReplace(error.dish)}>
              Replace
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Restaurant Info Section */}
      <section className="bg-white shadow-lg py-8 px-4 md:px-12">
        <div className="flex flex-col items-center md:flex-row md:items-center md:justify-start">
          <div className="w-40 h-40 md:w-48 md:h-48 mb-4 md:mb-0 rounded-lg overflow-hidden shadow-md">
            {restaurant.images ? (
              <img
                src={restaurant.images}
                alt={restaurant.name}
                className="object-cover w-full h-full"
              />
            ) : null}
          </div>
          <div className="md:ml-8 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg text-gray-700">{restaurant.description}</p>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-12 px-4 md:px-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {restaurant.dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} handleAdd={handleAdd} />
          ))}
        </div>
      </section>

      {cart.items.length ? (
      <Link to="/summary">
      <Button
        radius="none"
        size="lg"
        endContent={<FaArrowRight />}
        className="bg-yellow-500 font-bold hover:bg-yellow-400 hover:shadow-[0_0_30px_5px_rgb(234,179,8)]
      text-white shadow-[0_0_20px_3px_rgb(234,179,8)] sticky z-50
      bottom-0 w-full h-16
      md:bottom-8 md:right-8 md:rounded-lg md:w-fit md:absolute
      py-3 px-6 transition-all duration-300"
      >
        {cart.items.length} item(s) added
      </Button>
    </Link>
      ) : null}
    </div>
  );
}

export async function RestaurantPageLoader({ params }) {
  const [{ data: restaurant }, { data: dishes }] = await Promise.all([
    http.get(`/restaurants/${params.id}/`),
    http.get(`/restaurants/${params.id}/dishes/`),
  ]);

  return {
    ...restaurant,
    dishes,
  };
}
