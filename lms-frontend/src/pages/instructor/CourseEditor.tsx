import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  Plus,
  Send,
  Trash2,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import {
  createLesson,
  createSection,
  deleteLesson,
  deleteSection,
  getCourse,
  publishCourse,
} from '../../api/instructor.api'

export default function CourseEditor() {
  const { id } = useParams()
  const courseId = Number(id)
  const queryClient = useQueryClient()

  const [sectionTitle, setSectionTitle] = useState('')
  const [lessonSection, setLessonSection] = useState<number | null>(null)

  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    duration: 600,
    is_preview: false,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['instructor-course', courseId],
    queryFn: () => getCourse(courseId),
  })

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey: ['instructor-course', courseId],
    })

  const addSection = useMutation({
    mutationFn: () =>
      createSection(courseId, {
        title: sectionTitle,
        sort_order: (course?.sections?.length ?? 0) + 1,
      }),

    onSuccess: () => {
      setSectionTitle('')
      refresh()
    },
  })

  const addLesson = useMutation({
    mutationFn: () =>
      createLesson(lessonSection!, {
        title: lessonForm.title,
        content: lessonForm.content,
        duration: Number(lessonForm.duration),
        sort_order:
          ((course?.sections ?? []).find(
            (section: any) => section.id === lessonSection,
          )?.lessons?.length ?? 0) + 1,
        is_preview: lessonForm.is_preview,
      }),

    onSuccess: () => {
      setLessonSection(null)

      setLessonForm({
        title: '',
        content: '',
        duration: 600,
        is_preview: false,
      })

      refresh()
    },
  })

  const removeSection = useMutation({
    mutationFn: deleteSection,
    onSuccess: refresh,
  })

  const removeLesson = useMutation({
    mutationFn: deleteLesson,
    onSuccess: refresh,
  })

  const publish = useMutation({
    mutationFn: () => publishCourse(courseId),

    onSuccess: () => {
      refresh()

      queryClient.invalidateQueries({
        queryKey: ['instructor-courses'],
      })
    },
  })

  if (isLoading) {
    return <p className="text-sm text-slate-500">Đang tải...</p>
  }

  const course = data?.data ?? data

  if (!course) return <p>Không tìm thấy khóa học.</p>

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/instructor/courses"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500"
      >
        <ArrowLeft size={16} />
        Khóa học
      </Link>

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <div className="mb-2 flex items-center gap-2">
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
          </div>

          <h1 className="text-2xl font-semibold text-slate-900">
            {course.title}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Xây dựng cấu trúc chương và bài học.
          </p>
        </div>

        {course.status !== 'PUBLISHED' && (
          <button
            onClick={() => publish.mutate()}
            disabled={publish.isPending}
            className="flex items-center justify-center gap-2 rounded-md bg-[#17243d] px-4 py-2.5 text-sm font-medium text-white"
          >
            <Send size={16} />
            Xuất bản
          </button>
        )}
      </div>

      {publish.isError && (
        <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Không thể xuất bản. Khóa học phải có ít nhất một bài học.
        </div>
      )}

      <section className="mt-8 rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold">Nội dung khóa học</h2>
        </div>

        {(course.sections ?? []).length === 0 && (
          <div className="py-10 text-center">
            <BookOpen size={32} className="mx-auto text-slate-300" />

            <p className="mt-3 text-sm text-slate-500">
              Chưa có chương nào.
            </p>
          </div>
        )}

        <div className="divide-y divide-slate-200">
          {(course.sections ?? []).map(
            (section: any, sectionIndex: number) => (
              <div key={section.id} className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400">
                      CHƯƠNG {sectionIndex + 1}
                    </p>

                    <h3 className="mt-1 font-medium text-slate-800">
                      {section.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Xóa chương này?')) {
                        removeSection.mutate(section.id)
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  {(section.lessons ?? []).map(
                    (lesson: any, lessonIndex: number) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={17} className="text-slate-400" />

                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {lessonIndex + 1}. {lesson.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {Math.ceil(
                                Number(lesson.duration ?? 0) / 60,
                              )}{' '}
                              phút
                              {lesson.is_preview && ' · Xem trước'}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (window.confirm('Xóa bài học này?')) {
                              removeLesson.mutate(lesson.id)
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ),
                  )}
                </div>

                {lessonSection === section.id ? (
                  <div className="mt-4 rounded-md bg-slate-50 p-4">
                    <input
                      value={lessonForm.title}
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          title: e.target.value,
                        })
                      }
                      placeholder="Tên bài học"
                      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                    />

                    <textarea
                      value={lessonForm.content}
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          content: e.target.value,
                        })
                      }
                      rows={5}
                      placeholder="Nội dung bài học"
                      className="mt-3 w-full resize-none rounded-md border border-slate-300 bg-white p-3 text-sm"
                    />

                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <label className="text-sm text-slate-600">
                        Thời lượng (giây)
                        <input
                          type="number"
                          min="0"
                          value={lessonForm.duration}
                          onChange={(e) =>
                            setLessonForm({
                              ...lessonForm,
                              duration: Number(e.target.value),
                            })
                          }
                          className="ml-2 h-9 w-24 rounded border border-slate-300 px-2"
                        />
                      </label>

                      <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={lessonForm.is_preview}
                          onChange={(e) =>
                            setLessonForm({
                              ...lessonForm,
                              is_preview: e.target.checked,
                            })
                          }
                        />
                        Cho phép xem trước
                      </label>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => setLessonSection(null)}
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                      >
                        Hủy
                      </button>

                      <button
                        disabled={!lessonForm.title || addLesson.isPending}
                        onClick={() => addLesson.mutate()}
                        className="rounded-md bg-[#17243d] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                      >
                        Thêm bài học
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setLessonSection(section.id)}
                    className="mt-4 flex items-center gap-2 text-sm font-medium text-[#243b64]"
                  >
                    <Plus size={16} />
                    Thêm bài học
                  </button>
                )}
              </div>
            ),
          )}
        </div>

        <div className="border-t border-slate-200 p-5">
          <div className="flex gap-2">
            <input
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Tên chương mới"
              className="h-10 flex-1 rounded-md border border-slate-300 px-3 text-sm"
            />

            <button
              disabled={!sectionTitle.trim() || addSection.isPending}
              onClick={() => addSection.mutate()}
              className="flex items-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              <Plus size={16} />
              Thêm chương
            </button>
          </div>
        </div>
      </section>

      {course.status === 'PUBLISHED' && (
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 size={19} />
          Khóa học đang được hiển thị cho học viên.
        </div>
      )}
    </div>
  )
}
