
import { Button, ButtonGroup, Image } from '@nextui-org/react';
import React from 'react';
import { IoAdd, IoRemove } from 'react-icons/io5';
import fallback from '../assets/fallback-res-image.png';

import { useCartContext } from "../providers/cart-service"

export function DishCard({ dish, handleAdd }) {
  const cart = useCartContext()
  const inCart = cart.items.find(item => item.dish.id === dish.id)?.quantity || 0

  return (
    <div key={dish.id} className="bg-white rounded-lg flex flex-col shadow-md hover:shadow-lg transition duration-300">
      <Image src={dish.image || fallback} alt={dish.name} className={"w-full aspect-[2.4] rounded-md " + dish.image ? 'object-cover' : 'object-contain'} />
      <h3 className="text-xl font-semibold px-6">{dish.name}</h3>
      <p className="text-gray-600 px-6">{dish.description}</p>
      {/* <p className='text-gray-500 px-6 text-sm mt-1'>Made with {dish.ingredients}</p> */}
      <div className='flex justify-between mt-auto items-center px-6 pb-6 pt-4'>
        <p className="text-yellow-500 font-bold text-lg">${dish.price}</p>
        <ButtonGroup size='sm'>
          {inCart ? <>
            <Button isIconOnly color='primary' variant='flat' onClick={() => cart.removeItem(dish)} 
              className='bg-yellow-500 hover:bg-yellow-600 text-white transition duration-300'>
              <IoRemove />
            </Button>
            <div className='bg-yellow-500 text-white transition duration-300 py-1 px-2'>{inCart}</div>
          </> : null}
          {inCart ?
            <Button
              onClick={() => handleAdd(dish)}
              isIconOnly
              className='bg-yellow-500 hover:bg-yellow-600 text-white transition duration-300'
            >
              <IoAdd />
            </Button> :
            <Button
              onClick={() => handleAdd(dish)}
              endContent={<IoAdd size={16} />}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 transition duration-300">
              Add
            </Button>
          }
        </ButtonGroup>
      </div>
    </div>
  )
}