import axios from '../utils/axiosInterceptors'

export const loginAPI = async (email: string, password: string) => {
  const response = await axios.post('/user/login', {
    email,
    password,
  })
  return response.data
}
export const forgetPasswordAPI = async (email: string) => {
  const response = await axios.post('/user/forget-password', {
    email,
  })
  return response.data
}
export const resendOtpAPI = async (email: string) => {
  const response = await axios.post('/user/resend-otp', {
    email,
  })
  return response.data
}

export const verifyOtpAPI = async (email: string, otp: string) => {
  const response = await axios.post('/user/verify-otp', {
    email,
    otp,
  })
  return response.data
}

export const resetPasswordAPI = async (
  email: string,
  password: string,
  confirmPassword: string
) => {
  const response = await axios.put('/user/reset-password', {
    email: email,
    newPassword: password,
    confirmation: confirmPassword,
  })
  return response.data
}

export const registerAPI = async (
  email: string,
  password: string,
  confirmPassword: string
) => {
  const response = await axios.post('/user/signup', {
    email: email,
    password: password,
    confirmation: confirmPassword,
  })
  return response.data
}

export const getUserAPI = async () => {
  const response = await axios.get('/user/get-user')
  return response.data
}

export const updateProfileAPI = async (
  name: string,
  phone: string,
  email: string,
  avatar: any
) => {
  const formData = new FormData()
  if (avatar) {
    formData.append('image', avatar)
  }
  formData.append('name', name)
  formData.append('phone', phone)
  formData.append('email', email)

  const response = await axios.put('/user/update-profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const updateAvatarAPI = async (avatar: any) => {
  const formData = new FormData()
  formData.append('image', avatar)

  const response = await axios.put('/user/update-avatar', formData, {
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
  const response = await axios.put('/user/change-password', {
    oldPassword: oldPassword,
    newPassword: newPassword,
    confirmation: confirmNewPassword,
  })
  return response.data
}
