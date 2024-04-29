import axios from '../utils/axiosInterceptors'

export const createPaymentUrlAPI = async (
  orderId: string,
  bankCode: string
) => {
  const response = await axios.post(`/vnpay/create_payment_url`, {
    orderId,
    bankCode,
  })
  return response.data
}
export const createOrderAPI = async (
  schedule_id: string,
  seats: Array<string>
) => {
  const response = await axios.post(`/order/create`, {
    schedule_id,
    seats,
  })
  return response.data
}
export const getOrdersAPI = async () => {
  const response = await axios.get(`/order/get-orders`)
  return response.data
}

export const getTicketsAPI = async () => {
  const response = await axios.get(`/order/get-tickets`)
  return response.data
}
export const getTicketDetailAPI = async (orderId: string) => {
  const response = await axios.get(`/order/get-ticket-detail`, {
    params: { orderId },
  })
  return response.data
}
export const getOrderDetailAPI = async (orderId: string) => {
  const response = await axios.get(`/order/get-ticket-detail`, {
    params: { orderId },
  })
  return response.data
}
export const cancelOrderAPI = async (orderId: string) => {
  const response = await axios.put(`/order/cancel?orderId=${orderId}`)
  return response.data
}
