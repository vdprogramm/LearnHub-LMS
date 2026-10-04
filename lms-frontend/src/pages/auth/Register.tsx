import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import axios from 'axios'
import api from '../../api/axios'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()

    setError('')

    if (form.password !== form.password_confirmation) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    setLoading(true)

    try {
      await api.post('/register', form)
      navigate('/login')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errors = error.response?.data?.errors

        if (errors) {
          const firstError = Object.values(errors)[0]

          if (Array.isArray(firstError)) {
            setError(String(firstError[0]))
          } else {
            setError(String(firstError))
          }
        } else {
          setError(
            error.response?.data?.message ??
              'Không thể đăng ký tài khoản.',
          )
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5">
          <Link
            to="/login"
            className="flex items-center gap-3 font-semibold text-slate-900"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#17243d] text-white">
              <BookOpen size={18} />
            </span>

            LearnHub
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-7">
            <h1 className="text-2xl font-semibold text-slate-900">
              Tạo tài khoản học viên
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Đăng ký để tham gia các khóa học trên hệ thống.
            </p>
          </div>

          <form
            onSubmit={submit}
            className="rounded-lg border border-slate-200 bg-white p-6"
          >
            <Field label="Họ và tên">
              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
                className="h-11 w-full rounded-md border border-slate-300 px-3"
              />
            </Field>

            <Field label="Email">
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({
                    ...form,
                    email: event.target.value,
                  })
                }
                className="h-11 w-full rounded-md border border-slate-300 px-3"
              />
            </Field>

            <Field label="Mật khẩu">
              <input
                required
                minLength={8}
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({
                    ...form,
                    password: event.target.value,
                  })
                }
                className="h-11 w-full rounded-md border border-slate-300 px-3"
              />
            </Field>

            <Field label="Nhập lại mật khẩu">
              <input
                required
                minLength={8}
                type="password"
                value={form.password_confirmation}
                onChange={(event) =>
                  setForm({
                    ...form,
                    password_confirmation: event.target.value,
                  })
                }
                className="h-11 w-full rounded-md border border-slate-300 px-3"
              />
            </Field>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="h-11 w-full rounded-md bg-[#17243d] text-sm font-medium text-white disabled:opacity-60"
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>

            <p className="mt-5 text-center text-sm text-slate-500">
              Đã có tài khoản?{' '}
              <Link
                to="/login"
                className="font-medium text-[#243b64]"
              >
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {children}
    </div>
  )
}
