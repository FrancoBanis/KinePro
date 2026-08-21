import React, { createContext, useContext, useEffect, useState } from 'react'

export interface User {
  id?: number
  nombre?: string
  apellido?: string
  fechaNacimiento?: string
  email?: string
  rol?: string | number
  dni?: number
}

interface AuthContextType {
  user: User | null
  setUser: (u: User | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(() => {
    const raw = sessionStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    if (user) sessionStorage.setItem('user', JSON.stringify(user))
    else sessionStorage.removeItem('user')
  }, [user])

  const setUser = (u: User | null) => setUserState(u)
  const logout = () => setUserState(null)

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
