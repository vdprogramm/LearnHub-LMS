import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BookOpen, Pencil, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  deleteCourse,
  getInstructorCourses,
} from '../../api/instructor.api'

export default function InstructorCourses() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['instructor-courses'],
    queryFn: getInstructorCourses,
  })

  const remove = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['instructor-courses'],
      }),
  })

  const courses = data?.data ?? []

  const handleDelete = (id: number) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa khóa học này?')) return
    remove.mutate(id)
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Khóa học của tôi
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Tạo và quản lý nội dung giảng dạy.
          </p>
        </div>

        <Link
          to="/instructor/courses/new"
          className="flex items-center gap-2 rounded-md bg-[#17243d] px-4 py-2.5 text-sm font-medium text-white"
        >
          <Plus size={17} />
          Tạo mới
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Đang tải...</p>
      ) : courses.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white py-16 text-center">
          <BookOpen size={36} className="mx-auto text-slate-300" />

          <p className="mt-4 text-sm text-slate-500">
            Bạn chưa tạo khóa học nào.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Khóa học</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3">Giá</th>
                  <th className="px-5 py-3">Học viên</th>
                  <th className="px-5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {courses.map((course: any) => (
                  <tr key={course.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">
                        {course.title}
                      </p>
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
                      {Number(course.price) === 0
                        ? 'Miễn phí'
                        : `${Number(course.price).toLocaleString('vi-VN')} đ`}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {course.enrollments_count ?? 0}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/instructor/courses/${course.id}`}
                          className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          onClick={() => handleDelete(course.id)}
                          className="rounded-md border border-slate-300 p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
