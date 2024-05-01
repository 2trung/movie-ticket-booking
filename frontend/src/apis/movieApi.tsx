import axios from '../utils/axiosInterceptors'

export const getHomePageAPI = async () => {
  const response = await axios.get(`/movie/home`)
  return response.data
}
export const getNowPlayingAPI = async () => {
  const response = await axios.get(`/movie/now-playing`)
  return response.data
}
export const getComingSoonAPI = async () => {
  const response = await axios.get(`/movie/coming-soon`)
  return response.data
}
export const getMovieDetailAPI = async (id: string) => {
  const response = await axios.get(`/movie?movieId=${id}`)
  return response.data
}
export const searchMovieAPI = async (query: string) => {
  const response = await axios.get(`/movie/search?query=${query}`)
  return response.data
}

export const getMovieScheduleAPI = async (movieId: string) => {
  const response = await axios.get(`/movie/schedule?movieId=${movieId}`)
  return response.data
}
