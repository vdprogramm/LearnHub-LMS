import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BookOpen,
  Search,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function Courses() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['courses', search],
    queryFn: async () => {
      const response = await api.get('/courses', {
        params: search ? { search } : {},
      })

      return response.data
    },
  })

  const courses = data?.data ?? []

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-900">
          Khóa học
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Khám phá các khóa học hiện có trên hệ thống.
        </p>
      </div>

      <div className="mb-6 max-w-lg">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tên khóa học..."
            className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#243b64]"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">
          Đang tải khóa học...
        </p>
      ) : courses.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white py-16 text-center">
          <BookOpen
            size={36}
            className="mx-auto text-slate-300"
          />

          <p className="mt-4 text-sm text-slate-500">
            Không tìm thấy khóa học.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course: any) => (
            <article
              key={course.id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <div className="flex h-40 items-center justify-center bg-[#e9edf3]">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookOpen
                    size={38}
                    className="text-slate-400"
                  />
                )}
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                  <UserRound size={14} />
                  {course.instructor?.name ?? 'Giảng viên'}
                </div>

                <h2 className="line-clamp-2 min-h-12 font-semibold leading-6 text-slate-900">
                  {course.title}
                </h2>

                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                  {course.description || 'Chưa có mô tả khóa học.'}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="font-semibold text-slate-900">
                    {Number(course.price) === 0
                      ? 'Miễn phí'
                      : `${Number(course.price).toLocaleString('vi-VN')} đ`}
                  </span>

                  <Link
                    to={`/student/courses/${course.id}`}
                    className="rounded-md bg-[#17243d] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#223455]"
                  >
                    Xem khóa học
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
