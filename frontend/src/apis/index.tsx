import axios from '../utils/axiosInterceptors'
import { API_ROOT } from '../utils/apiRoot'

export const loginAPI = async (email, password) => {
  const response = await axios.post(`${API_ROOT}/user/login`, {
    email,
    password,
  })
  return response.data
}
export const forgetPasswordAPI = async (email) => {
  const response = await axios.post(`${API_ROOT}/user/forget-password`, {
    email,
  })
  return response.data
}
export const resendOtpAPI = async (email) => {
  const response = await axios.post(`${API_ROOT}/user/resend-otp`, {
    email,
  })
  return response.data
}

export const verifyOtpAPI = async (email, otp) => {
  const response = await axios.post(`${API_ROOT}/user/verify-otp`, {
    email,
    otp,
  })
  return response.data
}

export const resetPasswordAPI = async (email, password, confirmPassword) => {
  const response = await axios.put(`${API_ROOT}/user/reset-password`, {
    email: email,
    newPassword: password,
    confirmation: confirmPassword,
  })
  return response.data
}

export const registerAPI = async (email, password, confirmPassword) => {
  const response = await axios.post(`${API_ROOT}/user/signup`, {
    email: email,
    password: password,
    confirmation: confirmPassword,
  })
  return response.data
}

export const getUserAPI = async () => {
  const response = await axios.get(`${API_ROOT}/user/get-user`)
  return response.data
}

export const updateProfileAPI = async (name, phone, email) => {
  const response = await axios.put(`${API_ROOT}/user/update-profile`, {
    name: name,
    phone: phone,
    email: email,
  })
  return response.data
}

export const updateAvatarAPI = async (avatar) => {
  const formData = new FormData()
  formData.append('image', avatar)

  const response = await axios.put(`${API_ROOT}/user/update-avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const changePasswordAPI = async (
  oldPassword,
  newPassword,
  confirmNewPassword
) => {
  const response = await axios.put(`${API_ROOT}/user/change-password`, {
    oldPassword: oldPassword,
    newPassword: newPassword,
    confirmation: confirmNewPassword,
  })
  return response.data
}

export const getMovieDetailsAPI = async (movieId) => {
  const response = await axios.get(`${API_ROOT}/movie?movieId=${movieId}`)
  return response
}
