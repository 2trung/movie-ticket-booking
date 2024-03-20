import { createSlice } from '@reduxjs/toolkit'

interface UserState {
  email: string
  accessToken: string
  avatar: string
  name: string
  phone: string
}

const initialState: UserState = {
  email: '',
  accessToken: '',
  avatar: '',
  name: '',
  phone: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: initialState,
  },
  reducers: {
    addUser: (state, action) => {
      state.userData = action.payload
    },

    removeUser: (state, action) => {
      state.userData = initialState
    },
  },
})

export const userReducer = userSlice.reducer
export const { addUser, removeUser } = userSlice.actions

export const userSelector = (state: any) => state.userReducer.userData
