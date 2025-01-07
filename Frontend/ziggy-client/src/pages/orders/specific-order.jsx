import { useFetcher, useLoaderData, useSubmit } from "react-router-dom";
import { http } from "../../utils/http";
import { Button, Chip } from "@nextui-org/react";
import { useUserContext } from "../../providers/user-service";

export function SpecificOrderPage() {
  const order = useLoaderData()
  const submit = useSubmit()
  const u = useUserContext()

  const total = order.items.reduce((sum, item) => sum + parseFloat(item.price), 0)
  return (
    <div className="min-h-screen bg-gray-100 font-sans py-12 px-4 md:px-12">
      <h1 className="text-3xl font-bold text-center mb-8">Order #{order.id}</h1>

      <section className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-3xl mx-auto">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-semibold mb-4">Items</h2>
          <Chip>{order.status}</Chip>
        </div>
        <div className="divide-y divide-gray-200">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between py-4">
              <div>
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="text-lg font-semibold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center gap-4 max-w-3xl mx-auto">
        <div className="flex justify-between w-full py-2 font-bold text-xl">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        {u.user.is_restaurant && order.status !== 'DELIVERED' && <Button
          onPress={() => submit(new FormData(), {method: 'POST'})} 
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300">
          Mark as Delivered
        </Button>}
      </section>

    </div>
  )
  
}

export async function SpecificOrderPageLoader({ params }) {
  const { data } = await http.get('/orders/' + params.id)
  return data
}

export async function SpecificOrderPageAction({ params }) {
  return await http.patch('/orders/' + params.id + '/', {
    status: "DELIVERED"
  })
}