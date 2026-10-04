import { useState } from 'react'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { Search, Users as UsersIcon } from 'lucide-react'
import {
  getUsers,
  updateUserRole,
} from '../../api/admin.api'

type Role = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'

const roleLabels: Record<Role, string> = {
  ADMIN: 'Quản trị viên',
  INSTRUCTOR: 'Giảng viên',
  STUDENT: 'Học viên',
}

export default function Users() {
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, role],
    queryFn: () =>
      getUsers({
        search: search || undefined,
        role: role || undefined,
      }),
  })

  const roleMutation = useMutation({
    mutationFn: ({
      id,
      role,
    }: {
      id: number
      role: Role
    }) => updateUserRole(id, role),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-users'],
      })

      queryClient.invalidateQueries({
        queryKey: ['admin-dashboard'],
      })
    },
  })

  const users = data?.data ?? []

  const changeRole = (id: number, nextRole: Role) => {
    if (
      !window.confirm(
        `Bạn muốn thay đổi vai trò tài khoản này thành "${roleLabels[nextRole]}"?`,
      )
    ) {
      return
    }

    roleMutation.mutate({
      id,
      role: nextRole,
    })
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-900">
          Người dùng
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Danh sách tài khoản và quyền truy cập hệ thống.
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-md flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm tên hoặc email..."
            className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#243b64]"
          />
        </div>

        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
        >
          <option value="">Tất cả vai trò</option>
          <option value="STUDENT">Học viên</option>
          <option value="INSTRUCTOR">Giảng viên</option>
          <option value="ADMIN">Quản trị viên</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <p className="p-5 text-sm text-slate-500">
            Đang tải người dùng...
          </p>
        ) : users.length === 0 ? (
          <div className="py-14 text-center">
            <UsersIcon
              size={34}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm text-slate-500">
              Không tìm thấy người dùng.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Người dùng</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Vai trò</th>
                  <th className="px-5 py-3">Ngày tạo</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {users.map((user: any) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-medium text-slate-600">
                          {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium text-slate-800">
                            {user.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            ID #{user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {user.email}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        disabled={roleMutation.isPending}
                        onChange={(event) =>
                          changeRole(
                            user.id,
                            event.target.value as Role,
                          )
                        }
                        className="rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm"
                      >
                        <option value="STUDENT">Học viên</option>
                        <option value="INSTRUCTOR">Giảng viên</option>
                        <option value="ADMIN">Quản trị viên</option>
                      </select>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString(
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
