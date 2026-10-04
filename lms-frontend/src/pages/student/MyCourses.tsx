import { useQuery } from '@tanstack/react-query'
import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function MyCourses() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => {
      const response = await api.get('/my-courses')
      return response.data
    },
  })

  const enrollments = data?.data ?? []

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-900">
          Khóa học của tôi
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Các khóa học bạn đã đăng ký.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Đang tải...</p>
      ) : enrollments.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white py-14 text-center">
          <BookOpen
            className="mx-auto text-slate-300"
            size={35}
          />

          <p className="mt-3 text-sm text-slate-600">
            Bạn chưa đăng ký khóa học nào.
          </p>

          <Link
            to="/student/courses"
            className="mt-4 inline-block text-sm font-medium text-[#243b64]"
          >
            Xem danh sách khóa học
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment: any) => {
            const course = enrollment.course ?? enrollment
            const completed = enrollment.status === 'COMPLETED'

            return (
              <div
                key={enrollment.id}
                className="flex flex-col justify-between gap-5 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        completed
                          ? 'bg-green-50 text-green-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {completed ? 'Đã hoàn thành' : 'Đang học'}
                    </span>
                  </div>

                  <h2 className="font-semibold text-slate-900">
                    {course.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {course.instructor?.name ?? ''}
                  </p>
                </div>

                <Link
                  to={`/student/my-courses/${course.id}`}
                  className="rounded-md border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {completed ? 'Xem lại' : 'Tiếp tục học'}
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
