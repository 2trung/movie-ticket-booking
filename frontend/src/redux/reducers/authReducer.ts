import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_ROOT } from '../../utils/apiRoot'
import { setItemAsync, deleteItemAsync } from 'expo-secure-store'
import Toast from 'react-native-toast-message'

interface AuthState {
  isLogin: boolean
  isLoading: boolean
  email: string
  accessToken: string
  refreshToken: string
}

const initialState: AuthState = {
  isLogin: false,
  isLoading: false,
  email: '',
  accessToken: '',
  refreshToken: '',
}
export const login = createAsyncThunk(
  'user/login',
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(`${API_ROOT}/user/login`, {
        email,
        password,
      })
      const jsonData = response.data
      return jsonData
    } catch (error) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data)
      } else {
        return thunkAPI.rejectWithValue(error.message)
      }
    }
  }
)
export const register = createAsyncThunk(
  'user/register',
  async (
    {
      email,
      password,
      confirmation,
    }: { email: string; password: string; confirmation: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(`${API_ROOT}/user/signup`, {
        email,
        password,
        confirmation,
      })
      const jsonData = response.data
      return jsonData
    } catch (error) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data)
      } else {
        return thunkAPI.rejectWithValue(error.message)
      }
    }
  }
)

export const forgetPassword = createAsyncThunk(
  'user/forgetPassword',
  async ({ email }: { email: string }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_ROOT}/user/forget-password`, {
        email,
      })
      const jsonData = response.data
      return jsonData
    } catch (error) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data)
      } else {
        return thunkAPI.rejectWithValue(error.message)
      }
    }
  }
)

export const resendOtp = createAsyncThunk(
  'user/resendOtp',
  async ({ email }: { email: string }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_ROOT}/user/resend-otp`, {
        email,
      })
      const jsonData = response.data
      return jsonData
    } catch (error) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data)
      } else {
        return thunkAPI.rejectWithValue(error.message)
      }
    }
  }
)

export const verifyOtp = createAsyncThunk(
  'user/verifyOtp',
  async ({ email, otp }: { email: string; otp: string }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_ROOT}/user/verify-otp`, {
        email,
        otp,
      })
      const jsonData = response.data
      return jsonData
    } catch (error) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data)
      } else {
        return thunkAPI.rejectWithValue(error.message)
      }
    }
  }
)

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (
    {
      email,
      newPassword,
      confirmation,
    }: { email: string; newPassword: string; confirmation: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.put(`${API_ROOT}/user/reset-password`, {
        email,
        newPassword,
        confirmation,
      })
      const jsonData = response.data
      return jsonData
    } catch (error) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data)
      } else {
        return thunkAPI.rejectWithValue(error.message)
      }
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authData: initialState,
  },
  reducers: {
    addAuth: (state, action) => {
      state.authData.isLogin = true
      state.authData.isLoading = false
      state.authData.email = action.payload.email
      state.authData.accessToken = action.payload.accessToken
      state.authData.refreshToken = action.payload.refreshToken
    },
    logout: (state, action) => {
      state.authData = initialState
      deleteItemAsync('tokens')
    },
    setEmail: (state, action) => {
      state.authData.email = action.payload
    },
  },
  extraReducers: (builder) => {
    // Đăng nhập
    builder.addCase(login.pending, (state, action) => {
      state.authData.isLoading = true
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.authData.isLoading = false
      state.authData.isLogin = true
      state.authData.email = action.payload.data.email
      state.authData.accessToken = action.payload.data.accessToken
      state.authData.refreshToken = action.payload.data.refreshToken
      setItemAsync(
        'tokens',
        JSON.stringify({
          accessToken: action.payload.data.accessToken,
          refreshToken: action.payload.data.refreshToken,
        })
      )
    })
    builder.addCase(login.rejected, (state, action) => {
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
      state.authData.isLoading = false
    })

    // Đăng ký
    builder.addCase(register.pending, (state, action) => {
      state.authData.isLoading = true
    })
    builder.addCase(register.fulfilled, (state, action) => {
      Toast.show({
        type: 'success',
        text1: (action.payload as any)?.message,
      })
      state.authData.isLoading = false
    })
    builder.addCase(register.rejected, (state, action) => {
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
      state.authData.isLoading = false
    })

    // Quên mật khẩu
    builder.addCase(forgetPassword.pending, (state, action) => {
      state.authData.isLoading = true
    })
    builder.addCase(forgetPassword.fulfilled, (state, action) => {
      Toast.show({
        type: 'success',
        text1: (action.payload as any)?.message,
      })
      state.authData.isLoading = false
      state.authData.email = action.payload.data.email
    })
    builder.addCase(forgetPassword.rejected, (state, action) => {
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
      state.authData.isLoading = false
    })

    // Gửi lại mã OTP
    builder.addCase(resendOtp.pending, (state, action) => {
      state.authData.isLoading = true
    })
    builder.addCase(resendOtp.fulfilled, (state, action) => {
      Toast.show({
        type: 'success',
        text1: (action.payload as any)?.message,
      })
      state.authData.isLoading = false
    })
    builder.addCase(resendOtp.rejected, (state, action) => {
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
      state.authData.isLoading = false
    })

    // Xác thực OTP
    builder.addCase(verifyOtp.pending, (state, action) => {
      state.authData.isLoading = true
    })
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      Toast.show({
        type: 'success',
        text1: (action.payload as any)?.message,
      })
      state.authData.isLoading = false
    })
    builder.addCase(verifyOtp.rejected, (state, action) => {
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
      state.authData.isLoading = false
    })

    // Đặt lại mật khẩu
    builder.addCase(resetPassword.pending, (state, action) => {
      state.authData.isLoading = true
    })
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      Toast.show({
        type: 'success',
        text1: (action.payload as any)?.message,
      })
      state.authData.isLoading = false
    })
    builder.addCase(resetPassword.rejected, (state, action) => {
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
      state.authData.isLoading = false
    })
  },
})

export const authReducer = authSlice.reducer
export const { addAuth, logout, setEmail } = authSlice.actions

export const authSelector = (state: any) => state.authReducer.authData
export const isLoginSelector = (state: any) =>
  state.authReducer.authData.isLogin
export const isLoadingSelector = (state: any) =>
  state.authReducer.authData.isLoading
export const emailSelector = (state: any) => state.authReducer.authData.email
