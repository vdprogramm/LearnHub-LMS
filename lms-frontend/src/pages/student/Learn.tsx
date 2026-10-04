import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Circle,
  FileText,
  Menu,
  X,
} from 'lucide-react'
import api from '../../api/axios'

export default function Learn() {
  const { id } = useParams()
  const courseId = Number(id)
  const queryClient = useQueryClient()

  const [selectedLessonId, setSelectedLessonId] =
    useState<number | null>(null)

  const [mobileLessons, setMobileLessons] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['enrolled-course', courseId],
    queryFn: async () => {
      const response = await api.get(`/my-courses/${courseId}`)
      return response.data
    },
  })

  const { data: progressData } = useQuery({
    queryKey: ['course-progress', courseId],
    queryFn: async () => {
      const response = await api.get(`/courses/${courseId}/progress`)
      return response.data
    },
  })

  const enrollment = data?.data ?? data
  const course = enrollment?.course ?? enrollment

  const lessons = useMemo(() => {
    if (!course?.sections) return []

    return course.sections.flatMap((section: any) =>
      (section.lessons ?? []).map((lesson: any) => ({
        ...lesson,
        sectionTitle: section.title,
      })),
    )
  }, [course])

  useEffect(() => {
    if (!selectedLessonId && lessons.length > 0) {
      setSelectedLessonId(lessons[0].id)
    }
  }, [lessons, selectedLessonId])

  const selectedLesson =
    lessons.find((lesson: any) => lesson.id === selectedLessonId) ??
    lessons[0]

  const progress = progressData?.data ?? progressData ?? {}

  const completedIds: number[] =
    progress.completed_lesson_ids ??
    progress.completed_lessons_ids ??
    []

  const isSelectedCompleted = selectedLesson
    ? completedIds.includes(selectedLesson.id)
    : false

  const completeMutation = useMutation({
    mutationFn: async (lessonId: number) => {
      const response = await api.post(`/lessons/${lessonId}/complete`)
      return response.data
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['course-progress', courseId],
      })

      await queryClient.invalidateQueries({
        queryKey: ['my-courses'],
      })

      await queryClient.invalidateQueries({
        queryKey: ['my-certificates'],
      })
    },
  })

  if (isLoading) {
    return <p className="text-sm text-slate-500">Đang tải bài học...</p>
  }

  if (!course) {
    return <p>Không tìm thấy khóa học hoặc bạn chưa đăng ký.</p>
  }

  const percentage =
    progress.progress ??
    progress.percentage ??
    (enrollment.status === 'COMPLETED' ? 100 : 0)

  const lessonSidebar = (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-slate-200 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Nội dung
            </p>

            <h2 className="mt-1 font-semibold text-slate-900">
              {course.title}
            </h2>
          </div>

          <button
            onClick={() => setMobileLessons(false)}
            className="lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-slate-500">Tiến độ</span>
            <span className="font-medium text-slate-700">
              {Math.round(Number(percentage))}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#243b64] transition-all"
              style={{
                width: `${Math.min(100, Number(percentage))}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {(course.sections ?? []).map(
          (section: any, sectionIndex: number) => (
            <div
              key={section.id}
              className="border-b border-slate-100"
            >
              <div className="bg-slate-50 px-5 py-3">
                <p className="text-xs font-medium text-slate-500">
                  CHƯƠNG {sectionIndex + 1}
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {section.title}
                </p>
              </div>

              {(section.lessons ?? []).map(
                (lesson: any, lessonIndex: number) => {
                  const active = lesson.id === selectedLessonId
                  const completed = completedIds.includes(lesson.id)

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setSelectedLessonId(lesson.id)
                        setMobileLessons(false)
                      }}
                      className={`flex w-full items-start gap-3 border-t border-slate-100 px-5 py-4 text-left ${
                        active
                          ? 'bg-[#eef2f7]'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2
                          size={18}
                          className="mt-0.5 shrink-0 text-green-600"
                        />
                      ) : (
                        <Circle
                          size={18}
                          className="mt-0.5 shrink-0 text-slate-300"
                        />
                      )}

                      <div>
                        <p className="text-xs text-slate-400">
                          Bài {lessonIndex + 1}
                        </p>

                        <p className="mt-1 text-sm font-medium leading-5 text-slate-700">
                          {lesson.title}
                        </p>
                      </div>
                    </button>
                  )
                },
              )}
            </div>
          ),
        )}
      </div>
    </div>
  )

  return (
    <div className="-m-5 min-h-[calc(100vh-64px)] lg:-m-8">
      <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[330px_1fr]">
        <aside className="hidden border-r border-slate-200 lg:block">
          {lessonSidebar}
        </aside>

        {mobileLessons && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileLessons(false)}
            />

            <aside className="relative h-full w-[85%] max-w-sm">
              {lessonSidebar}
            </aside>
          </div>
        )}

        <main className="bg-[#f7f8fa]">
          <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-5 lg:px-8">
            <button
              onClick={() => setMobileLessons(true)}
              className="lg:hidden"
            >
              <Menu size={21} />
            </button>

            <Link
              to="/student/my-courses"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Khóa học của tôi
            </Link>
          </header>

          {!selectedLesson ? (
            <div className="p-8">
              <p>Khóa học chưa có bài học.</p>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl p-5 lg:p-10">
              <div className="mb-5">
                <p className="text-sm text-slate-500">
                  {selectedLesson.sectionTitle}
                </p>

                <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                  {selectedLesson.title}
                </h1>
              </div>

              <article className="rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <FileText size={17} />
                    Nội dung bài học
                  </div>
                </div>

                <div className="min-h-72 whitespace-pre-line p-6 leading-7 text-slate-700 lg:p-8">
                  {selectedLesson.content ||
                    'Bài học chưa có nội dung.'}
                </div>
              </article>

              <div className="mt-6 flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
                <div>
                  <p className="font-medium text-slate-800">
                    Hoàn thành bài học?
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Đánh dấu hoàn thành để cập nhật tiến độ khóa học.
                  </p>
                </div>

                <button
                  disabled={
                    completeMutation.isPending ||
                    isSelectedCompleted
                  }
                  onClick={() =>
                    completeMutation.mutate(selectedLesson.id)
                  }
                  className={`flex shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium ${
                    isSelectedCompleted
                      ? 'bg-green-50 text-green-700'
                      : 'bg-[#17243d] text-white hover:bg-[#223455]'
                  } disabled:cursor-default`}
                >
                  <Check size={17} />

                  {isSelectedCompleted
                    ? 'Đã hoàn thành'
                    : completeMutation.isPending
                      ? 'Đang cập nhật...'
                      : 'Đánh dấu hoàn thành'}
                </button>
              </div>

              {Number(percentage) >= 100 && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-5">
                  <h3 className="font-semibold text-green-800">
                    Khóa học đã hoàn thành
                  </h3>

                  <p className="mt-1 text-sm text-green-700">
                    Chứng chỉ của bạn đang được hệ thống xử lý.
                  </p>

                  <Link
                    to="/student/certificates"
                    className="mt-3 inline-block text-sm font-medium text-green-800 underline"
                  >
                    Xem chứng chỉ
                  </Link>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
