import api from './axios'

export async function createPayment(courseId: number) {
  const response = await api.post(
    `/courses/${courseId}/payments`,
  )

  return response.data
}

export async function getPayment(paymentId: number) {
  const response = await api.get(
    `/payments/${paymentId}`,
  )

  return response.data
}

export async function confirmPayment(paymentId: number) {
  const response = await api.post(
    `/payments/${paymentId}/confirm`,
  )

  return response.data
}

export async function getMyPayments() {
  const response = await api.get('/my-payments')
  return response.data
}
