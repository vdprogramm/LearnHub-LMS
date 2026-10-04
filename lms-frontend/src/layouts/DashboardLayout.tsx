import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  ScrollText,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const menus = {
  STUDENT: [
    { label: 'Tổng quan', path: '/student', icon: LayoutDashboard },
    { label: 'Khóa học', path: '/student/courses', icon: BookOpen },
    { label: 'Khóa học của tôi', path: '/student/my-courses', icon: GraduationCap },
    { label: 'Chứng chỉ', path: '/student/certificates', icon: ScrollText },
  ],

  INSTRUCTOR: [
    { label: 'Tổng quan', path: '/instructor', icon: LayoutDashboard },
    { label: 'Khóa học của tôi', path: '/instructor/courses', icon: BookOpen },
  ],

  ADMIN: [
    { label: 'Tổng quan', path: '/admin', icon: LayoutDashboard },
    { label: 'Người dùng', path: '/admin/users', icon: Users },
    { label: 'Khóa học', path: '/admin/courses', icon: BookOpen },
    { label: 'Đăng ký học', path: '/admin/enrollments', icon: GraduationCap },
    { label: 'Chứng chỉ', path: '/admin/certificates', icon: ScrollText },
  ],
}

const roleName = {
  STUDENT: 'Học viên',
  INSTRUCTOR: 'Giảng viên',
  ADMIN: 'Quản trị viên',
}

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null

  const items = menus[user.role]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-[#17243d] text-white">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-[#17243d]">
            <BookOpen size={19} />
          </div>

          <span className="text-lg font-semibold">
            LearnHub
          </span>
        </div>

        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/student' ||
                   item.path === '/instructor' ||
                   item.path === '/admin'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-white text-[#17243d] font-medium'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="mb-3 px-3 py-2">
          <p className="truncate text-sm font-medium">
            {user.name}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {roleName[user.role]}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="relative h-full w-72">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
          <button
            className="text-slate-600 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={23} />
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">
              Hệ thống quản lý học tập
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-800">
                {user.name}
              </p>

              <p className="text-xs text-slate-500">
                {user.email}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8edf5] text-sm font-semibold text-[#17243d]">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
