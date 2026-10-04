import { useQuery } from '@tanstack/react-query'
import { Award } from 'lucide-react'
import { getAdminCertificates } from '../../api/admin.api'

export default function AdminCertificates() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-certificates'],
    queryFn: () => getAdminCertificates(),
  })

  const certificates = data?.data ?? []

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-900">
          Chứng chỉ
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Danh sách chứng chỉ đã được hệ thống xử lý.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <p className="p-5 text-sm text-slate-500">Đang tải...</p>
        ) : certificates.length === 0 ? (
          <div className="py-14 text-center">
            <Award size={35} className="mx-auto text-slate-300" />

            <p className="mt-3 text-sm text-slate-500">
              Chưa có chứng chỉ.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Học viên</th>
                  <th className="px-5 py-3">Khóa học</th>
                  <th className="px-5 py-3">Mã chứng chỉ</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3">Ngày cấp</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {certificates.map((certificate: any) => (
                  <tr key={certificate.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">
                        {certificate.user?.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {certificate.user?.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {certificate.course?.title}
                    </td>

                    <td className="px-5 py-4 font-mono text-xs text-slate-500">
                      {certificate.cert_code}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          certificate.status === 'ISSUED'
                            ? 'bg-green-50 text-green-700'
                            : certificate.status === 'FAILED'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {certificate.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {certificate.issued_at
                        ? new Date(
                            certificate.issued_at,
                          ).toLocaleDateString('vi-VN')
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
