import axios from '../utils/axiosInterceptors'
import { API_ROOT } from '../utils/apiRoot'

export const getHomePageAPI = async () => {
  const response = await axios.get(`${API_ROOT}/movie/home`)
  return response.data
}
export const getNowPlayingAPI = async () => {
  const response = await axios.get(`${API_ROOT}/movie/now-playing`)
  return response.data
}
export const getComingSoonAPI = async () => {
  const response = await axios.get(`${API_ROOT}/movie/coming-soon`)
  return response.data
}
export const getMovieDetailAPI = async (id: string) => {
  const response = await axios.get(`${API_ROOT}/movie?movieId=${id}`)
  return response.data
}
