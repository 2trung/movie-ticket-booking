import axios from 'axios'
import { API_ROOT } from './apiRoot'
import { removeUser } from '../redux/reducers/userReducer'
import store from '../redux/store'
import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store'

const instance = axios.create({
  baseURL: API_ROOT,
})

instance.interceptors.request.use(
  async (config) => {
    try {
      const tokens = await getItemAsync('tokens')
      if (tokens) {
        const accessToken = JSON.parse(tokens).accessToken
        config.headers.Authorization = `Bearer ${accessToken}`
      }
    } catch (error) {
      return Promise.reject(error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {
        const tokens = await getItemAsync('tokens')
        if (tokens) {
          const refreshToken = JSON.parse(tokens).refreshToken
          const refreshResponse = await axios.post(
            `${API_ROOT}/user/refresh-token`,
            { refreshToken }
          )
          const { accessToken, refreshToken: newRefreshToken } =
            refreshResponse.data
          await setItemAsync(
            'tokens',
            JSON.stringify({
              accessToken: accessToken,
              refreshToken: newRefreshToken,
            })
          )
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return axios(originalRequest)
        }
      } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
          store.dispatch(removeUser({}))
          await deleteItemAsync('tokens')
        }
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default instance
