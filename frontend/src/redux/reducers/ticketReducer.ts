import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getOrdersAPI,
  getTicketsAPI,
  getTicketDetailAPI,
} from '../../apis/orderApi'
import Toast from 'react-native-toast-message'

interface Order {
  order_id: string
  order_time: string
  movie_name: string
  movie_poster: string
  total: number
  status: string
}

interface Ticket {
  order_id: string
  schedule_id: string
  start_time: string
  movie_name: string
  movie_poster: string
  cinema_name: string
  cinema_location: string
}
interface TicketDetail {
  order_id: string
  schedule_id: string
  start_time: string
  room_number: string
  movie_title: string
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

interface OrderHistoryState {
  isLoading: boolean
  orders: Order[]
  tickets: Ticket[]
  ticketDetail: TicketDetail
}

export const getOrdersHistory = createAsyncThunk(
  'ticket/all-orders',
  async (_, thunkAPI) => {
    try {
      const response = await getOrdersAPI()
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
export const getTickets = createAsyncThunk(
  'ticket/all-tickets',
  async (_, thunkAPI) => {
    try {
      const response = await getTicketsAPI()
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

export const getTicketDetail = createAsyncThunk(
  'ticket/detail',
  async (orderId: string, thunkAPI) => {
    try {
      const response = await getTicketDetailAPI(orderId)
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

const ticketSlice = createSlice({
  name: 'ticket',
  initialState: {
    isLoading: false,
    orders: null,
    tickets: null,
    ticketDetail: null,
  } as OrderHistoryState,
  reducers: {
    clearTickets: (state) => {
      state.tickets = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTickets.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getTickets.fulfilled, (state, action) => {
      state.isLoading = false
      state.tickets = action.payload
    })
    builder.addCase(getTickets.rejected, (state, action) => {
      state.isLoading = false
    })

    builder.addCase(getOrdersHistory.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getOrdersHistory.fulfilled, (state, action) => {
      state.isLoading = false
      state.orders = action.payload
    })
    builder.addCase(getOrdersHistory.rejected, (state, action) => {
      state.isLoading = false
    })

    builder.addCase(getTicketDetail.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getTicketDetail.fulfilled, (state, action) => {
      state.isLoading = false
      state.ticketDetail = action.payload
    })
    builder.addCase(getTicketDetail.rejected, (state, action) => {
      state.isLoading = false
    })
  },
})

export const ticketReducer = ticketSlice.reducer
export const { clearTickets } = ticketSlice.actions

export const ticketSelector = (state: any) => state.ticketReducer.tickets
export const orderSelector = (state: any) => state.ticketReducer.orders
export const ticketDetailSelector = (state: any) =>
  state.ticketReducer.ticketDetail
