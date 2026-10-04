import api from './axios'

export interface Course {
  id: number
  title: string
  slug?: string
  description?: string
  thumbnail?: string | null
  price: number | string
  status: 'DRAFT' | 'PUBLISHED'
  instructor?: {
    id: number
    name: string
    email?: string
  }
  sections_count?: number
  enrollments_count?: number
}

export async function getCourses(page = 1) {
  const response = await api.get('/courses', {
    params: { page },
  })

  return response.data
}

export async function getMyCourses() {
  const response = await api.get('/my-courses')
  return response.data
}

export async function enrollCourse(courseId: number) {
  const response = await api.post(`/courses/${courseId}/enroll`)
  return response.data
}

export async function getCourse(id: number) {
  const response = await api.get(`/courses/${id}`)
  return response.data
}

export async function getEnrolledCourse(id: number) {
  const response = await api.get(`/my-courses/${id}`)
  return response.data
}

export async function getCourseProgress(id: number) {
  const response = await api.get(`/courses/${id}/progress`)
  return response.data
}

export async function completeLesson(id: number) {
  const response = await api.post(`/lessons/${id}/complete`)
  return response.data
}
