import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, type Role } from '../context/AuthContext'

interface Props {
  roles?: Role[]
}

export default function ProtectedRoute({ roles }: Props) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7f9]">
        <p className="text-sm text-slate-500">Đang tải...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
