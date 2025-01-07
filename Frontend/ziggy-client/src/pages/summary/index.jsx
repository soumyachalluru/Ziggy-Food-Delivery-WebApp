// src/pages/OrderSummaryPage.js

import React from 'react';
import { Navigate, redirect, useSubmit } from 'react-router-dom';
import { useCartContext } from '../../providers/cart-service';
import { Button } from '@nextui-org/react';
import { http } from '../../utils/http';
import { useUserContext } from '../../providers/user-service';

export function OrderSummaryPage() {

  const cart = useCartContext()
  if (!cart.restaurant) {
    return <Navigate to='/search' />
  }

  const u = useUserContext()

  const submit = useSubmit()
  function handleSubmit() {
    submit({
      restaurant_id: cart.restaurant.id,
      delivery_address: u.user.address,
      items: cart.items.map(item => ({ quantity: item.quantity, dish_id: item.dish.id }))
    }, {
      method: 'POST',
      encType: 'application/json'
    })
    localStorage.removeItem('cart')
  }

  // Calculate total
  const total = cart.items.reduce((sum, item) => sum + parseFloat(item.dish.price) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 font-sans py-12 px-4 md:px-12">
      <h1 className="text-3xl font-bold text-center mb-8">Order Summary</h1>

      {/* Order Items List */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Your Items</h2>
        <div className="divide-y divide-gray-200">
          {cart.items.map(item => (
            <div key={item.id} className="flex justify-between py-4">
              <div>
                <h3 className="text-lg font-medium">{item.dish.name}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="text-lg font-semibold">${(parseFloat(item.dish.price) * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Total Summary Section */}
      <section className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center max-w-3xl mx-auto">
        <div className="flex justify-between w-full py-2 font-bold text-xl">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
        </div>

        {/* Payment Button */}
        <Button
          onPress={() => handleSubmit()}
          size='lg'
          className="mt-6 w-full md:w-fit bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 md:px-8 lg:px-12 transition duration-300"
        >
          Proceed to Payment
        </Button>
      </section>
    </div>
  );
}

export async function SummaryPageAction({ request }) {
  const order = await request.json()
  await http.post('/orders/', order)
  return redirect('/orders')
}