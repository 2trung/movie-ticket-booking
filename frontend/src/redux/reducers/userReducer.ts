import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getItemAsync } from 'expo-secure-store'
import axios from '../../utils/axiosInterceptors'
import { addAuth } from './authReducer'
import {
  changePasswordAPI,
  updateProfileAPI,
  updateAvatarAPI,
} from '../../apis/userApi'
import Toast from 'react-native-toast-message'

interface UserState {
  email: string
  avatar: string
  name: string
  phone: string
}

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (
    data: {
      oldPassword: string
      newPassword: string
      confirmNewPassword: string
    },
    thunkAPI
  ) => {
    try {
      const response = await changePasswordAPI(
        data.oldPassword,
        data.newPassword,
        data.confirmNewPassword
      )
      return response
    } catch (error) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data)
      } else {
        return thunkAPI.rejectWithValue(error.message)
      }
    }
  }
)
export const getUser = createAsyncThunk('user/getUser', async (_, thunkAPI) => {
  try {
    const tokens = await getItemAsync('tokens')
    if (tokens) {
      const response = await axios.get('/user/get-user')
      thunkAPI.dispatch(
        addAuth({
          isLogin: true,
          isLoading: false,
          email: response.data.email,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      )
      return response.data
    }
    return thunkAPI.rejectWithValue('Không có token')
  } catch (error) {
    if (error.response) {
      return thunkAPI.rejectWithValue(error.response.data)
    } else {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
})

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    data: {
      name: string
      phone: string
      email: string
      avatar: any
    },
    thunkAPI
  ) => {
    try {
      const response = await updateProfileAPI(
        data.name,
        data.phone,
        data.email,
        data.avatar
      )
      return response
    } catch (error) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data)
      } else {
        return thunkAPI.rejectWithValue(error.message)
      }
    }
  }
)

export const updateAvatar = createAsyncThunk(
  'user/updateAvatar',
  async (avatar: any, thunkAPI) => {
    try {
      const response = await updateAvatarAPI(avatar)
      return response
    } catch (error) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data)
      } else {
        return thunkAPI.rejectWithValue(error.message)
      }
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoading: false,
    userData: null as UserState,
  },
  reducers: {
    addUser: (state, action) => {
      state.userData = action.payload
    },
  },
  extraReducers: (builder) => {
    // Lấy thông tin người dùng
    builder.addCase(getUser.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.userData = action.payload
    })
    builder.addCase(getUser.rejected, (state, action) => {
      state.isLoading = false
      state.userData = null
    })

    // Đổi mật khẩu
    builder.addCase(changePassword.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.isLoading = false
      Toast.show({
        type: 'success',
        text1: (action.payload as any)?.message,
      })
    })
    builder.addCase(changePassword.rejected, (state, action) => {
      state.isLoading = false
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
    })

    // Cập nhật thông tin người dùng
    builder.addCase(updateUser.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.userData = action.payload.data
      Toast.show({
        type: 'success',
        text1: (action.payload as any)?.message,
      })
    })
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
    })

    // Cập nhật avatar
    builder.addCase(updateAvatar.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateAvatar.fulfilled, (state, action) => {
      state.isLoading = false
      state.userData = action.payload.data
      Toast.show({
        type: 'success',
        text1: (action.payload as any)?.message,
      })
    })
    builder.addCase(updateAvatar.rejected, (state, action) => {
      state.isLoading = false
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
    })
  },
})

export const userReducer = userSlice.reducer
export const { addUser } = userSlice.actions

export const userSelector = (state: any) => state.userReducer.userData
