import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RutaProtegida({ children }) {
  const { fiscal } = useAuth()
  if (!fiscal) return <Navigate to="/login" replace />
  return children
}
