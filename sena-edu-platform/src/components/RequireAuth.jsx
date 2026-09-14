import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Redirige a /entrada si el jugador no ha ingresado su nombre
export default function RequireAuth({ children }) {
  const { nombre } = useAuth()
  if (!nombre) return <Navigate to="/entrada" replace />
  return children
}
