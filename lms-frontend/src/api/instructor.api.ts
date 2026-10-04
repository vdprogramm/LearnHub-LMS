import api from './axios'

export interface CourseForm {
  title: string
  description: string
  price: number
  thumbnail?: string
}

export async function getInstructorCourses() {
  const response = await api.get('/instructor/courses')
  return response.data
}

export async function getCourse(id: number) {
  const response = await api.get(`/courses/${id}`)
  return response.data
}

export async function createCourse(data: CourseForm) {
  const response = await api.post('/courses', data)
  return response.data
}

export async function updateCourse(id: number, data: Partial<CourseForm>) {
  const response = await api.put(`/courses/${id}`, data)
  return response.data
}

export async function deleteCourse(id: number) {
  const response = await api.delete(`/courses/${id}`)
  return response.data
}

export async function publishCourse(id: number) {
  const response = await api.patch(`/courses/${id}/publish`)
  return response.data
}

export async function createSection(
  courseId: number,
  data: { title: string; sort_order: number },
) {
  const response = await api.post(`/courses/${courseId}/sections`, data)
  return response.data
}

export async function updateSection(
  sectionId: number,
  data: { title: string; sort_order: number },
) {
  const response = await api.put(`/sections/${sectionId}`, data)
  return response.data
}

export async function deleteSection(sectionId: number) {
  const response = await api.delete(`/sections/${sectionId}`)
  return response.data
}

export async function createLesson(
  sectionId: number,
  data: {
    title: string
    content: string
    duration: number
    sort_order: number
    is_preview: boolean
  },
) {
  const response = await api.post(`/sections/${sectionId}/lessons`, data)
  return response.data
}

export async function updateLesson(
  lessonId: number,
  data: {
    title?: string
    content?: string
    duration?: number
    sort_order?: number
    is_preview?: boolean
  },
) {
  const response = await api.put(`/lessons/${lessonId}`, data)
  return response.data
}

export async function deleteLesson(lessonId: number) {
  const response = await api.delete(`/lessons/${lessonId}`)
  return response.data
}
