import { useQuery } from '@tanstack/react-query'
import { GraduationCap } from 'lucide-react'
import { getAdminEnrollments } from '../../api/admin.api'

export default function AdminEnrollments() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-enrollments'],
    queryFn: () => getAdminEnrollments(),
  })

  const enrollments = data?.data ?? []

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-900">
          Đăng ký học
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Theo dõi học viên đang tham gia các khóa học.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <p className="p-5 text-sm text-slate-500">Đang tải...</p>
        ) : enrollments.length === 0 ? (
          <div className="py-14 text-center">
            <GraduationCap
              size={35}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm text-slate-500">
              Chưa có lượt đăng ký.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Học viên</th>
                  <th className="px-5 py-3">Khóa học</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3">Ngày đăng ký</th>
                  <th className="px-5 py-3">Hoàn thành</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {enrollments.map((item: any) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">
                        {item.user?.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {item.user?.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.course?.title}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          item.status === 'COMPLETED'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {item.status === 'COMPLETED'
                          ? 'Hoàn thành'
                          : 'Đang học'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {item.enrolled_at
                        ? new Date(item.enrolled_at).toLocaleDateString(
                            'vi-VN',
                          )
                        : '—'}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {item.completed_at
                        ? new Date(item.completed_at).toLocaleDateString(
                            'vi-VN',
                          )
                        : '—'}
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
