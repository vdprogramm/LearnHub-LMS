import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  Award,
  BookOpen,
  GraduationCap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function StudentDashboard() {
  const { user } = useAuth()

  const { data: courses } = useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => {
      const response = await api.get('/my-courses')
      return response.data
    },
  })

  const { data: certificates } = useQuery({
    queryKey: ['my-certificates'],
    queryFn: async () => {
      const response = await api.get('/my-certificates')
      return response.data
    },
  })

  const courseList = courses?.data ?? []
  const certificateList = certificates?.data ?? []

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="mb-1 text-sm text-slate-500">
          Xin chào,
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {user?.name}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Theo dõi việc học và tiếp tục khóa học của bạn.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<BookOpen size={20} />}
          label="Khóa học đang tham gia"
          value={courseList.length}
        />

        <StatCard
          icon={<GraduationCap size={20} />}
          label="Khóa học hoàn thành"
          value={
            courseList.filter(
              (item: any) => item.status === 'COMPLETED',
            ).length
          }
        />

        <StatCard
          icon={<Award size={20} />}
          label="Chứng chỉ"
          value={certificateList.length}
        />
      </div>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Khóa học gần đây
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Tiếp tục từ nơi bạn đã dừng lại.
            </p>
          </div>

          <Link
            to="/student/my-courses"
            className="flex items-center gap-1 text-sm font-medium text-[#243b64]"
          >
            Xem tất cả
            <ArrowRight size={15} />
          </Link>
        </div>

        {courseList.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <BookOpen
              size={32}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-medium text-slate-700">
              Bạn chưa tham gia khóa học nào
            </p>

            <Link
              to="/student/courses"
              className="mt-4 inline-block text-sm font-medium text-[#243b64]"
            >
              Tìm khóa học
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {courseList.slice(0, 4).map((item: any) => {
              const course = item.course ?? item

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">
                      {course.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.status === 'COMPLETED'
                        ? 'Đã hoàn thành'
                        : 'Đang học'}
                    </p>
                  </div>

                  <Link
                    to={`/student/my-courses/${course.id}`}
                    className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
                  >
                    Tiếp tục
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#edf1f6] text-[#243b64]">
          {icon}
        </div>

        <span className="text-2xl font-semibold text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-5 text-sm text-slate-500">
        {label}
      </p>
    </div>
  )
}
