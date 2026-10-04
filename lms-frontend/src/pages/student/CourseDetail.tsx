import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  PlayCircle,
  UserRound,
} from 'lucide-react'
import api from '../../api/axios'
import { createPayment } from '../../api/payment.api'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const courseId = Number(id)

  const [message, setMessage] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await api.get(`/courses/${courseId}`)
      return response.data
    },
    enabled: Number.isFinite(courseId),
  })

  const enroll = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/courses/${courseId}/enroll`)
      return response.data
    },

    onSuccess: () => {
      navigate(`/student/my-courses/${courseId}`)
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          navigate(`/student/my-courses/${courseId}`)
          return
        }

        setMessage(
          error.response?.data?.message ??
            'Không thể đăng ký khóa học.',
        )
      }
    },
  })

  const paymentMutation = useMutation({
    mutationFn: () => createPayment(Number(id)),

    onSuccess: (response) => {
      const payment = response.data

      navigate(`/student/payments/${payment.id}`)
    },
  })

  if (isLoading) {
    return <p className="text-sm text-slate-500">Đang tải khóa học...</p>
  }

  const course = data?.data ?? data

  if (!course) {
    return <p>Không tìm thấy khóa học.</p>
  }

  const sections = course.sections ?? []
  const lessonCount = sections.reduce(
    (total: number, section: any) =>
      total + (section.lessons?.length ?? 0),
    0,
  )

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/student/courses"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Quay lại khóa học
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
        <div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 lg:p-8">
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
              <UserRound size={16} />
              {course.instructor?.name ?? 'Giảng viên'}
            </div>

            <h1 className="text-3xl font-semibold leading-tight text-slate-900">
              {course.title}
            </h1>

            <p className="mt-5 whitespace-pre-line leading-7 text-slate-600">
              {course.description || 'Khóa học chưa có mô tả.'}
            </p>

            <div className="mt-6 flex flex-wrap gap-5 border-t border-slate-100 pt-5 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <BookOpen size={16} />
                {sections.length} chương
              </span>

              <span className="flex items-center gap-2">
                <PlayCircle size={16} />
                {lessonCount} bài học
              </span>
            </div>
          </div>

          <section className="mt-6 rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="font-semibold text-slate-900">
                Nội dung khóa học
              </h2>
            </div>

            {sections.length === 0 ? (
              <p className="px-6 py-8 text-sm text-slate-500">
                Chưa có nội dung.
              </p>
            ) : (
              <div className="divide-y divide-slate-200">
                {sections.map((section: any, sectionIndex: number) => (
                  <div key={section.id} className="p-6">
                    <h3 className="font-medium text-slate-800">
                      {sectionIndex + 1}. {section.title}
                    </h3>

                    <div className="mt-4 space-y-3">
                      {(section.lessons ?? []).map(
                        (lesson: any, lessonIndex: number) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between gap-4 text-sm"
                          >
                            <div className="flex items-center gap-3 text-slate-600">
                              <PlayCircle
                                size={16}
                                className="text-slate-400"
                              />

                              <span>
                                {sectionIndex + 1}.{lessonIndex + 1}{' '}
                                {lesson.title}
                              </span>
                            </div>

                            {lesson.duration && (
                              <span className="flex shrink-0 items-center gap-1 text-xs text-slate-400">
                                <Clock size={13} />
                                {Math.ceil(lesson.duration / 60)} phút
                              </span>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside>
          <div className="sticky top-24 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="flex h-44 items-center justify-center bg-[#e9edf3]">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <BookOpen size={42} className="text-slate-400" />
              )}
            </div>

            <div className="p-5">
              <p className="text-xl font-semibold text-slate-900">
                {Number(course.price) === 0
                  ? 'Miễn phí'
                  : `${Number(course.price).toLocaleString('vi-VN')} đ`}
              </p>

              {message && (
                <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {message}
                </p>
              )}

              {Number(course.price) > 0 ? (
                <button
                  onClick={() => paymentMutation.mutate()}
                  disabled={paymentMutation.isPending}
                  className="mt-4 h-11 w-full rounded-md bg-[#17243d] text-sm font-medium text-white hover:bg-[#223455] disabled:opacity-60"
                >
                  {paymentMutation.isPending
                    ? 'Đang tạo giao dịch...'
                    : `Thanh toán ${Number(course.price).toLocaleString('vi-VN')} đ`}
                </button>
              ) : (
                <button
                  onClick={() => enroll.mutate()}
                  disabled={enroll.isPending}
                  className="mt-4 h-11 w-full rounded-md bg-[#17243d] text-sm font-medium text-white hover:bg-[#223455] disabled:opacity-60"
                >
                  {enroll.isPending
                    ? 'Đang đăng ký...'
                    : 'Đăng ký khóa học'}
                </button>
              )}

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Học theo tiến độ cá nhân
                </p>

                <p className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Theo dõi tiến độ học tập
                </p>

                <p className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Chứng chỉ khi hoàn thành
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
