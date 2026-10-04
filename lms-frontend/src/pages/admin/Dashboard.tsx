import { useQuery } from '@tanstack/react-query'
import {
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  UserRound,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getAdminDashboard } from '../../api/admin.api'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getAdminDashboard,
  })

  const stats = data?.data ?? {}

  if (isLoading) {
    return <p className="text-sm text-slate-500">Đang tải thống kê...</p>
  }

  const roleData = [
    { name: 'Học viên', value: stats.total_students ?? 0 },
    { name: 'Giảng viên', value: stats.total_instructors ?? 0 },
  ]

  const courseData = [
    { name: 'Đã xuất bản', value: stats.published_courses ?? 0 },
    { name: 'Bản nháp', value: stats.draft_courses ?? 0 },
  ]

  const COLORS = ['#243b64', '#3b82f6']

  return (
    <div className="mx-auto max-w-7xl">
      <div>
        <p className="text-sm text-slate-500">Quản trị hệ thống</p>

        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          Tổng quan
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Xin chào {user?.name}. Đây là tình trạng hiện tại của hệ thống.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={<Users size={20} />}
          value={stats.total_users ?? 0}
          label="Người dùng"
        />

        <Stat
          icon={<BookOpen size={20} />}
          value={stats.total_courses ?? 0}
          label="Khóa học"
        />

        <Stat
          icon={<GraduationCap size={20} />}
          value={stats.total_enrollments ?? 0}
          label="Lượt đăng ký"
        />

        <Stat
          icon={<Award size={20} />}
          value={stats.total_certificates ?? 0}
          label="Chứng chỉ"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Tỷ lệ Người dùng</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => {
                    const safePercent = percent ?? 0;
                    return `${name} ${(safePercent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Trạng thái Khóa học</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#243b64" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Người dùng
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            <Row
              label="Học viên"
              value={stats.total_students ?? 0}
              icon={<GraduationCap size={17} />}
            />

            <Row
              label="Giảng viên"
              value={stats.total_instructors ?? 0}
              icon={<UserRound size={17} />}
            />
          </div>

          <div className="border-t border-slate-100 px-5 py-4">
            <Link
              to="/admin/users"
              className="text-sm font-medium text-[#243b64]"
            >
              Quản lý người dùng →
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Hoạt động học tập
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            <Row
              label="Khóa học đã xuất bản"
              value={stats.published_courses ?? 0}
              icon={<BookOpen size={17} />}
            />

            <Row
              label="Khóa học bản nháp"
              value={stats.draft_courses ?? 0}
              icon={<BookOpen size={17} />}
            />

            <Row
              label="Đã hoàn thành khóa học"
              value={stats.completed_enrollments ?? 0}
              icon={<CheckCircle2 size={17} />}
            />

            <Row
              label="Chứng chỉ đã cấp"
              value={stats.issued_certificates ?? 0}
              icon={<Award size={17} />}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: number
  label: string
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#edf1f6] text-[#243b64]">
          {icon}
        </span>

        <strong className="text-2xl font-semibold text-slate-900">
          {value}
        </strong>
      </div>

      <p className="mt-5 text-sm text-slate-500">{label}</p>
    </div>
  )
}

function Row({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <span className="text-slate-400">{icon}</span>
        {label}
      </div>

      <strong className="text-sm text-slate-900">{value}</strong>
    </div>
  )
}
