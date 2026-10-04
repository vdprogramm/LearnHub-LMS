import api from './axios'

export async function getAdminDashboard() {
  const response = await api.get('/admin/dashboard')
  return response.data
}

export async function getUsers(params?: {
  role?: string
  search?: string
  page?: number
}) {
  const response = await api.get('/admin/users', { params })
  return response.data
}

export async function updateUserRole(
  userId: number,
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT',
) {
  const response = await api.patch(`/admin/users/${userId}/role`, {
    role,
  })

  return response.data
}

export async function getAdminCourses(page = 1) {
  const response = await api.get('/admin/courses', {
    params: { page },
  })

  return response.data
}

export async function getAdminEnrollments(page = 1) {
  const response = await api.get('/admin/enrollments', {
    params: { page },
  })

  return response.data
}

export async function getAdminCertificates(page = 1) {
  const response = await api.get('/admin/certificates', {
    params: { page },
  })

  return response.data
}
