import { createContext, useContext, useState } from "react";
import { http } from "../utils/http";

import { jwtDecode } from 'jwt-decode'
import { useNavigate } from "react-router-dom";

const userContext = createContext(null)

export function UserProvider({ children }) {
  
  const t = localStorage.getItem('token')
  if (t) {
    http.defaults.headers.common.Authorization = 'Bearer ' + t
  }
  const [user, setUser] = useState(t ? jwtDecode(t) : null)

  async function auth(formData, url) {
    const { data: { access } } = await http.post(url, formData)
    localStorage.setItem('token', access)
    http.defaults.headers.common.Authorization = 'Bearer ' + access
    const u = jwtDecode(access)
    setUser(u)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('cart')
    http.defaults.headers.common.Authorization = null
    setUser(null)
  }

  return (
    <userContext.Provider value={{ user, auth, logout}}>
      {children}
    </userContext.Provider>
  )
}

export function useUserContext() {
  return useContext(userContext)
}