import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  getOrderDetailAPI,
  createOrderAPI,
  createPaymentUrlAPI,
  cancelOrderAPI,
} from '../../apis/orderApi'
import { getMovieScheduleAPI } from '../../apis/movieApi'
import { getScheduleDetailAPI } from '../../apis/scheduleApi'
import Toast from 'react-native-toast-message'

// Phim
export interface Movie {
  _id: string
  title: string
  description: string
  releaseDate: string
  duration: number
  genres: string[]
  cast: People[]
  director: People[]
  trailer: string
  cens: string
  poster: string
  rating: number
  rating_count: string
  isPlaying: boolean
}

export interface People {
  _id: string
  name: string
  photo: string
}

// Tất cả lịch chiếu của phim đang chọn được sắp xếp theo ngày
export interface ScheduleByDate {
  date: string
  schedule: ScheduleByHour[]
}

export interface ScheduleByHour {
  cinema: {
    cinema_id: string
    cinema_name: string
    cinema_location: string
  }
  times: Array<{
    schedule_id: string
    time: string
  }>
}

// Lịch chiếu chi tiết
export interface ScheduleDetail {
  _id: string
  movie_id: string
  room_id: string
  start_time: string
  end_time: string
  reserved_seats: any[]
  pending_seats: any[]
  price: number
  room: Room
}

export interface Room {
  _id: string
  room_number: string
  cinema_id: string
  row: number
  column: number
  seats: string[]
  cinema_name: string
  cinema_location: string
}

export interface Order {
  order_id: string
  schedule_id: string
  start_time: string
  room_number: string
  movie_name: string
  movie_poster: string
  movie_genres: string[]
  movie_duration: number
  cinema_name: string
  cinema_location: string
  selectedSeats: string[]
  total: number
  order_time: string
  status: string
}

export interface OrderState {
  movieData: Movie
  schedulesData: ScheduleByDate[]
  scheduleDetailData: ScheduleDetail
  orderData: Order
}

const initialState = {
  movieData: null,
  scheduleDetailData: null,
  schedulesData: null,
  orderData: null,
  paymentUrl: '',
}

export const getOrderDetail = createAsyncThunk(
  'order/detail',
  async (orderId: string, thunkAPI) => {
    try {
      const response = await getOrderDetailAPI(orderId)
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

export const getMovieSchedules = createAsyncThunk(
  'order/schedule',
  async (movieId: string, thunkAPI) => {
    try {
      const response = await getMovieScheduleAPI(movieId)
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
export const getScheduleDetail = createAsyncThunk(
  'order/scheduleDetail',
  async (scheduleId: string, thunkAPI) => {
    try {
      const response = await getScheduleDetailAPI(scheduleId)
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

export const createPaymentUrl = createAsyncThunk(
  'order/createPaymentUrl',
  async (orderDetail: any, thunkAPI) => {
    try {
      const response = await createPaymentUrlAPI(
        orderDetail.orderId,
        orderDetail.bankCode
      )
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

export const createOrder = createAsyncThunk(
  'order/create',
  async (order: any, thunkAPI) => {
    try {
      const response = await createOrderAPI(order.scheduleId, order.seats)
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

export const cancelOrder = createAsyncThunk(
  'order/cancel',
  async (orderId: string, thunkAPI) => {
    try {
      const response = await cancelOrderAPI(orderId)
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

const orderSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {
    setMovie: (state, action) => {
      state.movieData = action.payload
    },
    setSchedule: (state, action) => {
      state.schedulesData = action.payload
    },
    setOrder: (state, action) => {
      state.orderData = action.payload
    },
    resetOrder: (state) => {
      state = initialState
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.orderData = action.payload
    })
    builder.addCase(createOrder.rejected, (state, action) => {
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
    })

    builder.addCase(getOrderDetail.fulfilled, (state, action) => {
      state.orderData = action.payload
    })
    builder.addCase(getOrderDetail.rejected, (state, action) => {
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
    })

    builder.addCase(getMovieSchedules.fulfilled, (state, action) => {
      state.schedulesData = action.payload
    })
    builder.addCase(getMovieSchedules.rejected, (state, action) => {
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
    })

    builder.addCase(getScheduleDetail.fulfilled, (state, action) => {
      state.scheduleDetailData = action.payload
    })
    builder.addCase(getScheduleDetail.rejected, (state, action) => {
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
    })

    builder.addCase(createPaymentUrl.fulfilled, (state, action) => {
      state.paymentUrl = action.payload
    })
    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      state.orderData = action.payload
      Toast.show({
        type: 'success',
        text1: (action.payload as any)?.message,
      })
    })
    builder.addCase(cancelOrder.rejected, (state, action) => {
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
    })
  },
})

export const orderReducer = orderSlice.reducer
export const { setMovie, setSchedule, setOrder, resetOrder } =
  orderSlice.actions

export const movieSelector = (state: any) =>
  state.orderReducer.orderData.movieData

export const scheduleSelector = (state: any) => state.orderReducer.schedulesData
export const scheduleDetailSelector = (state: any) =>
  state.orderReducer.scheduleDetailData

export const orderSelector = (state: any) => state.orderReducer.orderData
export const paymentUrlSelector = (state: any) => state.orderReducer.paymentUrl
