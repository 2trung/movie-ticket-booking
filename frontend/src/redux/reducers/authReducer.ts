import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
  email: string
  accessToken: string
  avatar: string
}

const initialState: AuthState = {
  email: '',
  accessToken: '',
  avatar: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authData: initialState,
  },
  reducers: {
    addAuth: (state, action) => {
      state.authData = action.payload
    },

    removeAuth: (state, action) => {
      state.authData = initialState
    },
  },
})

export const authReducer = authSlice.reducer
export const { addAuth, removeAuth } = authSlice.actions

export const authSelector = (state: any) => state.authReducer.authData
