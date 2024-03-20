import axios from 'axios'
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

export const updateProfileAPI = async (accessToken, name, phone, email) => {
  const response = await axios.put(
    `${API_ROOT}/user/update-profile`,
    {
      name: name,
      phone: phone,
      email: email,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  return response.data
}

export const updateAvatarAPI = async (accessToken, avatar) => {
  const formData = new FormData()
  formData.append('image', avatar)

  const response = await axios.put(`${API_ROOT}/user/update-avatar`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const changePasswordAPI = async (
  accessToken,
  oldPassword,
  newPassword,
  confirmNewPassword
) => {
  const response = await axios.put(
    `${API_ROOT}/user/change-password`,
    {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmation: confirmNewPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  return response.data
}
