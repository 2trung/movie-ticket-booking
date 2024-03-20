import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_ROOT } from '../utils/constaints'

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

export const getUserAPI = async (accessToken) => {
  const response = await axios.get(`${API_ROOT}/user/get-user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}
export const updateAvatarAPI = async (accessToken, image) => {
  const response = await axios.put(`${API_ROOT}/user/update-avatar`, image, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}
