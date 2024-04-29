import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { searchMovieAPI } from '../../apis/movieApi'
import Toast from 'react-native-toast-message'

interface Movie {
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

interface MoviesProps {
  isLoading: boolean
  movies: Array<Movie>
}

const initialState: MoviesProps = {
  isLoading: false,
  movies: [],
}

export const searchMovie = createAsyncThunk(
  'search/byName',
  async (query: string, thunkAPI) => {
    try {
      const response = await searchMovieAPI(query)
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

const searchSlice = createSlice({
  name: 'search',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(searchMovie.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(searchMovie.fulfilled, (state, action) => {
      state.isLoading = false
      state.movies = action.payload
    })
    builder.addCase(searchMovie.rejected, (state, action) => {
      state.isLoading = false
      state.movies = []
    })
  },
})

export const searchReducer = searchSlice.reducer
export const searchResultSelector = (state: any) => state.searchReducer.movies
export const searchStateSelector = (state: any) => state.searchReducer.isLoading
