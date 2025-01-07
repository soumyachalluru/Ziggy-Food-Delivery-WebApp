import * as React from "react";

import { Button, NextUIProvider } from "@nextui-org/react";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  useNavigate,
  useRouteError
} from "react-router-dom";
import { LandingPage } from "./pages";
import { SearchPage, SearchPageLoader } from "./pages/search";
import { RestaurantPage, RestaurantPageLoader } from "./pages/restaurant";
import { CartProvider } from "./providers/cart-service";
import { OrderSummaryPage, SummaryPageAction } from "./pages/summary";
import { SignUp } from "./pages/auth/signup";
import { LogIn } from "./pages/auth/login";
import { RestaurantSignUp } from "./pages/auth/restaurant-sign-up";
import { UserProvider, useUserContext } from "./providers/user-service";
import { OrdersPageLoader, OrdersPage } from "./pages/orders";
import RestaurantProfile, { RestaurantProfileLoader } from "./pages/orders/restaurant-profile";
import { http } from "./utils/http";
import { SpecificOrderPage, SpecificOrderPageAction, SpecificOrderPageLoader } from "./pages/orders/specific-order";
import { HttpStatusCode, isAxiosError } from "axios";
import logo from '../src/assets/logo.png'


function tokenLoader() {
  const t = localStorage.getItem('token')
  if (t) http.defaults.headers.common.Authorization = 'Bearer ' + t
  return null
}

function ErrorElement() {
  const error = useRouteError()

  if (isAxiosError(error) && (error.status === HttpStatusCode.Forbidden || error.status === HttpStatusCode.Unauthorized)) {
      return <Navigate to='/log-in' />
  }

  return <h1>something went wrong</h1>
}

function AuthGuard() {
  const u = useUserContext()
  if (!u.user) return <Navigate to='/' />
  return <Outlet />
}

function LogoAdder() {
  const navigate = useNavigate()
  return <>
    <img src={logo} onClick={() => navigate('/')} alt="logo" width={50} className="absolute cursor-pointer top-8 left-8 z-50" />
    <Outlet />
  </>
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<LogoAdder />} loader={tokenLoader} errorElement={<ErrorElement />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/log-in" element={<LogIn />} />
      <Route path="/restaurant-sign-up" element={<RestaurantSignUp />} />
      <Route path="/search" element={<SearchPage />} loader={SearchPageLoader} />
      <Route path="/restaurants/:id" element={<RestaurantPage />} loader={RestaurantPageLoader} />
      
      <Route element={<AuthGuard />}>
        <Route path="/summary" element={<OrderSummaryPage />} action={SummaryPageAction} />
        <Route path="/orders" element={<OrdersPage />} loader={OrdersPageLoader} />
        <Route path="/orders/:id" element={<SpecificOrderPage />} loader={SpecificOrderPageLoader} action={SpecificOrderPageAction} />
        <Route path="/restaurant-profile" element={<RestaurantProfile />}  loader={RestaurantProfileLoader} />   
      </Route>
    </Route>
  )
)

function App() {
  return (
    <NextUIProvider>
      <UserProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </UserProvider>
    </NextUIProvider>
  )
}

export default App
