import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { getAuthToken } from "@/lib/api"

interface ProtectedRouteProps {
  children: ReactNode
  isLoggedIn: boolean
  user: any
  loading: boolean
  requiredRole?: "ADMIN" | "USER"
}

export function ProtectedRoute({ children, isLoggedIn, user, loading, requiredRole }: ProtectedRouteProps) {
  const location = useLocation()
  const token = getAuthToken()

  // Jika masih loading auth, tampilkan loading screen atau null
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Jika tidak ada token atau tidak login, arahkan ke login
  if (!token || !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Jika role tidak sesuai, arahkan ke beranda (atau halaman 403)
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
