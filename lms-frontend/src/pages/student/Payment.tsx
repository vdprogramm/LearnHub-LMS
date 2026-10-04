import { useMutation, useQuery } from '@tanstack/react-query'
import { CheckCircle2, CreditCard } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  confirmPayment,
  getPayment,
} from '../../api/payment.api'

export default function Payment() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['payment', id],
    queryFn: () => getPayment(Number(id)),
    enabled: Boolean(id),
  })

  const payment = data?.data

  const confirmMutation = useMutation({
    mutationFn: () => confirmPayment(Number(id)),

    onSuccess: (response) => {
      const courseId =
        response.data?.course_id ??
        response.data?.course?.id ??
        payment?.course_id

      navigate(`/student/my-courses/${courseId}`)
    },
  })

  if (isLoading) {
    return (
      <p className="text-sm text-slate-500">
        Đang tải giao dịch...
      </p>
    )
  }

  if (!payment) {
    return (
      <p className="text-sm text-red-600">
        Không tìm thấy giao dịch.
      </p>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-7">
        <p className="text-sm text-slate-500">
          Thanh toán khóa học
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          Xác nhận thanh toán
        </h1>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-[#243b64]">
              <CreditCard size={20} />
            </span>

            <div>
              <p className="text-sm text-slate-500">
                Khóa học
              </p>

              <h2 className="font-semibold text-slate-900">
                {payment.course?.title}
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <Row
            label="Mã giao dịch"
            value={payment.transaction_code}
          />

          <Row
            label="Phương thức"
            value="Thanh toán mô phỏng"
          />

          <Row
            label="Trạng thái"
            value={
              payment.status === 'SUCCESS'
                ? 'Đã thanh toán'
                : 'Chờ thanh toán'
            }
          />

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-end justify-between">
              <span className="text-sm text-slate-500">
                Tổng thanh toán
              </span>

              <strong className="text-2xl text-slate-900">
                {Number(payment.amount).toLocaleString(
                  'vi-VN',
                )}{' '}
                đ
              </strong>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
          {payment.status === 'SUCCESS' ? (
            <div className="flex items-center gap-2 text-sm font-medium text-green-700">
              <CheckCircle2 size={18} />
              Giao dịch đã hoàn thành.
            </div>
          ) : (
            <button
              onClick={() => confirmMutation.mutate()}
              disabled={confirmMutation.isPending}
              className="h-11 w-full rounded-md bg-[#17243d] text-sm font-medium text-white disabled:opacity-60"
            >
              {confirmMutation.isPending
                ? 'Đang xử lý...'
                : 'Xác nhận thanh toán'}
            </button>
          )}

          {confirmMutation.isError && (
            <p className="mt-3 text-sm text-red-600">
              Thanh toán không thành công. Vui lòng thử lại.
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Đây là môi trường thanh toán mô phỏng phục vụ hệ thống LMS.
      </p>
    </div>
  )
}

function Row({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex justify-between gap-5 text-sm">
      <span className="text-slate-500">{label}</span>

      <span className="text-right font-medium text-slate-800">
        {value}
      </span>
    </div>
  )
}
