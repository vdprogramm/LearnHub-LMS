import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import api from '../api/axios'

export type Role = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'

export interface User {
  id: number
  name: string
  email: string
  role: Role
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get('/me')

        const currentUser = response.data.data ?? response.data.user ?? response.data
        setUser(currentUser)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.post('/login', {
      email,
      password,
    })

    const token =
      response.data.token ??
      response.data.access_token ??
      response.data.data?.token

    const loggedUser =
      response.data.user ??
      response.data.data?.user

    if (!token || !loggedUser) {
      throw new Error('Login response không đúng định dạng.')
    }

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(loggedUser))

    setUser(loggedUser)

    return loggedUser as User
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
