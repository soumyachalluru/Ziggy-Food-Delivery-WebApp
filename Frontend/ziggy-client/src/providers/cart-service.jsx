import { createContext, useCallback, useContext, useEffect, useState } from "react";

export class CartAlreadyExistsError extends Error {
  constructor(message, restaurant, dish) {
    super(message)
    this.name = 'CartAlreadyExistsError'
    this.restaurant = restaurant
    this.dish = dish
  }
}

const cartContext = createContext(null)

export function CartProvider({ children }) {
  const cart = JSON.parse(localStorage.getItem('cart') || 'null')
  const [restaurant, setRestaurant] = useState(cart?.restaurant)
  const [items, setItems] = useState(cart?.items || [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({ restaurant, items }))
  }, [items, restaurant])

  const addItem = (restnt, dish) => {
    if (restaurant && restaurant.id !== restnt.id) 
      throw new CartAlreadyExistsError("cart exists with dishes from " + restaurant.name, restaurant, dish)

    if (!restaurant) setRestaurant(restnt)

    const existing = items.findIndex(item => item.dish.id === dish.id)
    if (existing === -1) setItems(prev => [...prev, {quantity: 1, dish}])
    else setItems(prev => [
      ...prev.slice(0, existing),
      {quantity: items[existing].quantity + 1, dish},
      ...prev.slice(existing + 1)
    ])
  }

  const removeItem = (dish) => {
    const existing = items.findIndex(item => item.dish.id === dish.id)

    if (items[existing].quantity === 1) {
      setItems(prev => [
        ...prev.slice(0, existing),
        ...prev.slice(existing + 1)
      ])
      return
    }

    setItems(prev => [
      ...prev.slice(0, existing),
      { quantity: items[existing].quantity - 1, dish },
      ...prev.slice(existing + 1)
    ])
  }

  const replace = (restaurant, dish) => {
    setRestaurant(restaurant)
    setItems([{quantity: 1, dish}])
  }

  return (
    <cartContext.Provider value={{ items, restaurant, addItem, removeItem, replace }}>
      {children}
    </cartContext.Provider>
  )
}

export function useCartContext() {
  return useContext(cartContext)
}