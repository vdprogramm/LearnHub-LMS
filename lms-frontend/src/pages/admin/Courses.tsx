import { useQuery } from '@tanstack/react-query'
import { BookOpen } from 'lucide-react'
import { getAdminCourses } from '../../api/admin.api'

export default function AdminCourses() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => getAdminCourses(),
  })

  const courses = data?.data ?? []

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-900">
          Khóa học
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Theo dõi toàn bộ khóa học trên hệ thống.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <p className="p-5 text-sm text-slate-500">Đang tải...</p>
        ) : courses.length === 0 ? (
          <div className="py-14 text-center">
            <BookOpen size={34} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">
              Chưa có khóa học.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Khóa học</th>
                  <th className="px-5 py-3">Giảng viên</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3">Chương</th>
                  <th className="px-5 py-3">Học viên</th>
                  <th className="px-5 py-3">Giá</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {courses.map((course: any) => (
                  <tr key={course.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">
                        {course.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        #{course.id}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {course.instructor?.name ?? '—'}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          course.status === 'PUBLISHED'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {course.status === 'PUBLISHED'
                          ? 'Đã xuất bản'
                          : 'Bản nháp'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {course.sections_count ?? 0}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {course.enrollments_count ?? 0}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {Number(course.price) === 0
                        ? 'Miễn phí'
                        : `${Number(course.price).toLocaleString(
                            'vi-VN',
                          )} đ`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
