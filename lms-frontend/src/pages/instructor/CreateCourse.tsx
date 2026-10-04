import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { createCourse } from '../../api/instructor.api'

export default function CreateCourse() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: 0,
    thumbnail: '',
  })

  const mutation = useMutation({
    mutationFn: createCourse,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['instructor-courses'],
      })

      const course = response.data ?? response

      navigate(`/instructor/courses/${course.id}`)
    },
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()

    mutation.mutate({
      ...form,
      price: Number(form.price),
      thumbnail: form.thumbnail || undefined,
    })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/instructor/courses"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500"
      >
        <ArrowLeft size={16} />
        Khóa học
      </Link>

      <div className="mb-7">
        <h1 className="text-2xl font-semibold">Tạo khóa học</h1>

        <p className="mt-2 text-sm text-slate-500">
          Tạo thông tin cơ bản trước, nội dung bài học sẽ thêm ở bước sau.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="rounded-lg border border-slate-200 bg-white p-6"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            Tên khóa học
          </label>

          <input
            required
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#243b64]"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium">
            Mô tả
          </label>

          <textarea
            rows={6}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full resize-none rounded-md border border-slate-300 p-3 outline-none focus:border-[#243b64]"
          />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Giá khóa học
            </label>

            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: Number(e.target.value),
                })
              }
              className="h-11 w-full rounded-md border border-slate-300 px-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              URL ảnh bìa
            </label>

            <input
              type="url"
              value={form.thumbnail}
              onChange={(e) =>
                setForm({ ...form, thumbnail: e.target.value })
              }
              placeholder="https://..."
              className="h-11 w-full rounded-md border border-slate-300 px-3"
            />
          </div>
        </div>

        {mutation.isError && (
          <p className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">
            Không thể tạo khóa học. Kiểm tra dữ liệu và thử lại.
          </p>
        )}

        <div className="mt-7 flex justify-end gap-3">
          <Link
            to="/instructor/courses"
            className="rounded-md border border-slate-300 px-4 py-2.5 text-sm"
          >
            Hủy
          </Link>

          <button
            disabled={mutation.isPending}
            className="rounded-md bg-[#17243d] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {mutation.isPending
              ? 'Đang tạo...'
              : 'Tạo và thêm nội dung'}
          </button>
        </div>
      </form>
    </div>
  )
}
