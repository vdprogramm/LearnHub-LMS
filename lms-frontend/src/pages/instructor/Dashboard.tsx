import { useQuery } from '@tanstack/react-query'
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Plus,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getInstructorCourses } from '../../api/instructor.api'
import { useAuth } from '../../context/AuthContext'

export default function InstructorDashboard() {
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['instructor-courses'],
    queryFn: getInstructorCourses,
  })

  const courses = data?.data ?? []

  const published = courses.filter(
    (course: any) => course.status === 'PUBLISHED',
  ).length

  const draft = courses.filter(
    (course: any) => course.status === 'DRAFT',
  ).length

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">Giảng viên</p>

          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            {user?.name}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Quản lý nội dung và các khóa học bạn phụ trách.
          </p>
        </div>

        <Link
          to="/instructor/courses/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#17243d] px-4 py-2.5 text-sm font-medium text-white"
        >
          <Plus size={17} />
          Tạo khóa học
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Stat
          icon={<BookOpen size={20} />}
          label="Tổng khóa học"
          value={courses.length}
        />

        <Stat
          icon={<CheckCircle2 size={20} />}
          label="Đã xuất bản"
          value={published}
        />

        <Stat
          icon={<Clock3 size={20} />}
          label="Bản nháp"
          value={draft}
        />
      </div>

      <section className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Khóa học gần đây
          </h2>

          <Link
            to="/instructor/courses"
            className="text-sm font-medium text-[#243b64]"
          >
            Xem tất cả
          </Link>
        </div>

        {isLoading ? (
          <p className="p-5 text-sm text-slate-500">Đang tải...</p>
        ) : courses.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Chưa có khóa học.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {courses.slice(0, 5).map((course: any) => (
              <div
                key={course.id}
                className="flex items-center justify-between gap-5 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">
                    {course.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {course.status === 'PUBLISHED'
                      ? 'Đã xuất bản'
                      : 'Bản nháp'}
                  </p>
                </div>

                <Link
                  to={`/instructor/courses/${course.id}`}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
                >
                  Quản lý
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function Stat({
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
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#edf1f6] text-[#243b64]">
          {icon}
        </span>

        <strong className="text-2xl font-semibold">{value}</strong>
      </div>

      <p className="mt-5 text-sm text-slate-500">{label}</p>
    </div>
  )
}
