import axios from '../utils/axiosInterceptors'

export const getScheduleDetailAPI = async (movieId) => {
  const response = await axios.get(`/schedule?id=${movieId}`)
  return response.data
}
