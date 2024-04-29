import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getHomePageAPI,
  getNowPlayingAPI,
  getComingSoonAPI,
  getMovieDetailAPI,
} from '../../apis/movieApi'
import Toast from 'react-native-toast-message'

interface movie {
  _id: string
  title: string
  description: string
  releaseDate: string
  duration: number
  genres: Array<string>
  cast: Array<string>
  director: string
  trailer: string
  cens: string
  poster: string
  rating: number
  rating_count: string
}

interface moviesProps {
  nowPlaying: Array<movie>
  comingSoon: Array<movie>
}

const initialState: moviesProps = {
  nowPlaying: [],
  comingSoon: [],
}
export const getHomePage = createAsyncThunk(
  'movie/home',
  async (_, thunkAPI) => {
    try {
      const response = await getHomePageAPI()
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

export const getComingSoon = createAsyncThunk(
  'movie/comingSoon',
  async (_, thunkAPI) => {
    try {
      const response = await getComingSoonAPI()
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

export const getNowPlaying = createAsyncThunk(
  'movie/nowPlaying',
  async (_, thunkAPI) => {
    try {
      return await getNowPlayingAPI()
    } catch (error) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data)
      } else {
        return thunkAPI.rejectWithValue(error.message)
      }
    }
  }
)

export const getMovieDetail = createAsyncThunk(
  'movie/detail',
  async (id: string, thunkAPI) => {
    try {
      const response = await getMovieDetailAPI(id)
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

const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    isLoading: false,
    moviesData: initialState,
    movieDetail: null as movie,
  },
  reducers: {
    clearMoviesData: (state, action) => {
      state.moviesData = initialState
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getHomePage.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getHomePage.fulfilled, (state, action) => {
      state.moviesData.comingSoon = action.payload.comingSoon
      state.moviesData.nowPlaying = action.payload.nowPlaying
      state.isLoading = false
    })
    builder.addCase(getHomePage.rejected, (state, action) => {
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
      state.isLoading = false
    })

    builder.addCase(getComingSoon.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getComingSoon.fulfilled, (state, action) => {
      state.moviesData.comingSoon = action.payload.data
    })
    builder.addCase(getComingSoon.rejected, (state, action) => {
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
      state.isLoading = false
    })

    builder.addCase(getNowPlaying.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getNowPlaying.fulfilled, (state, action) => {
      state.moviesData.nowPlaying = action.payload.data
    })
    builder.addCase(getNowPlaying.rejected, (state, action) => {
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
      state.isLoading = false
    })

    builder.addCase(getMovieDetail.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getMovieDetail.fulfilled, (state, action) => {
      state.movieDetail = action.payload
      state.isLoading = false
    })
    builder.addCase(getMovieDetail.rejected, (state, action) => {
      Toast.show({
        type: 'error',
        text1: (action.payload as any)?.message,
      })
      state.isLoading = false
    })
  },
})

export const movieReducer = movieSlice.reducer
export const { clearMoviesData } = movieSlice.actions

export const moviesSelector = (state: any) => state.movieReducer.moviesData
export const movieDetailSelector = (state: any) =>
  state.movieReducer.movieDetail
