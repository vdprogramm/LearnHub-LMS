import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { useAuth, type Role } from '../../context/AuthContext'

function getDashboard(role: Role) {
  switch (role) {
    case 'ADMIN':
      return '/admin'
    case 'INSTRUCTOR':
      return '/instructor'
    default:
      return '/student'
  }
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setSubmitting(true)
    setError('')

    try {
      const user = await login(email, password)
      navigate(getDashboard(user.role))
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            'Email hoặc mật khẩu không chính xác.',
        )
      } else {
        setError('Không thể đăng nhập. Vui lòng thử lại.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[1fr_520px]">
      <section className="hidden bg-[#17243d] px-16 py-12 text-white lg:flex lg:flex-col">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#17243d]">
            <BookOpen size={21} />
          </span>

          <span className="text-xl font-semibold tracking-tight">
            LearnHub
          </span>
        </Link>

        <div className="my-auto max-w-xl">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-slate-300">
            Learning Management System
          </p>

          <h1 className="text-4xl font-semibold leading-tight">
            Học tập có tổ chức,
            <br />
            tiến bộ có thể theo dõi.
          </h1>

          <p className="mt-6 max-w-lg leading-7 text-slate-300">
            Một nơi để học viên theo dõi khóa học, giảng viên quản lý
            nội dung và quản trị viên vận hành toàn bộ hệ thống.
          </p>
        </div>

        <p className="text-sm text-slate-400">
          © 2026 LearnHub
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-9 lg:hidden">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <BookOpen size={22} />
              LearnHub
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Đăng nhập
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Nhập tài khoản của bạn để tiếp tục.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-[#243b64] focus:ring-2 focus:ring-[#243b64]/10"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Mật khẩu
                </label>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  required
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 pr-11 text-sm outline-none transition focus:border-[#243b64] focus:ring-2 focus:ring-[#243b64]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="h-11 w-full rounded-md bg-[#17243d] text-sm font-medium text-white transition hover:bg-[#223455] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Chưa có tài khoản?{' '}
            <Link
              to="/register"
              className="font-medium text-[#243b64] hover:underline"
            >
              Đăng ký học viên
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
