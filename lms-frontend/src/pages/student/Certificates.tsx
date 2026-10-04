import { useQuery } from '@tanstack/react-query'
import {
  Award,
  Download,
} from 'lucide-react'
import api from '../../api/axios'

export default function Certificates() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-certificates'],
    queryFn: async () => {
      const response = await api.get('/my-certificates')
      return response.data
    },
  })

  const certificates = data?.data ?? []

  const download = async (id: number, code: string) => {
    const response = await api.get(
      `/certificates/${id}/download`,
      {
        responseType: 'blob',
      },
    )

    const url = URL.createObjectURL(response.data)
    const link = document.createElement('a')

    link.href = url
    link.download = `${code}.pdf`
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-900">
          Chứng chỉ
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Chứng chỉ của những khóa học bạn đã hoàn thành.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Đang tải...</p>
      ) : certificates.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white py-14 text-center">
          <Award
            size={38}
            className="mx-auto text-slate-300"
          />

          <p className="mt-3 text-sm text-slate-500">
            Bạn chưa có chứng chỉ.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Khóa học</th>
                  <th className="px-5 py-3">Mã chứng chỉ</th>
                  <th className="px-5 py-3">Ngày cấp</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3 text-right"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {certificates.map((certificate: any) => (
                  <tr key={certificate.id}>
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {certificate.course?.title}
                    </td>

                    <td className="px-5 py-4 font-mono text-xs text-slate-500">
                      {certificate.cert_code}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {certificate.issued_at
                        ? new Date(
                            certificate.issued_at,
                          ).toLocaleDateString('vi-VN')
                        : '—'}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        {certificate.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() =>
                          download(
                            certificate.id,
                            certificate.cert_code,
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium hover:bg-slate-50"
                      >
                        <Download size={14} />
                        PDF
                      </button>
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
