import { env } from '~/config/environment'
import { movieModel } from '~/models/movieModel'
import { scheduleModel } from '~/models/scheduleModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { roomModel } from '~/models/roomModel'
import { cinemaModel } from '~/models/cinemaModel'
import { peopleModel } from '~/models/peopleModel'

const addMovie = async (reqBody) => {
  try {
    const createdMovie = await movieModel.addMovie(reqBody)
    return {
      messege: 'Thêm phim thành công',
      data: { _id: createdMovie.insertedId },
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}
const getHomePageData = async () => {
  try {
    // Now Playing
    const nowPlaying = await getNowPlaying()

    // Coming Soon
    const comingSoon = await getComingSoon()

    return {
      message: 'Lấy dữ liệu thành công',
      data: { nowPlaying: nowPlaying.data, comingSoon: comingSoon.data },
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}

const getMovieDetails = async (movieId) => {
  try {
    const movie = await movieModel.getById(movieId)
    const schedules = await scheduleModel.getScheduleByMovieId(movieId)
    const isPlaying = schedules.some(
      (schedule) => schedule.start_time > Date.now()
    )
    const director = await peopleModel.getById(movie.director)
    let casts = []
    for (let cast of movie.cast) {
      const actor = await peopleModel.getById(cast)
      casts.push(actor)
    }

    return {
      message: 'Lấy dữ liệu thành công',
      data: { ...movie, director: director, cast: casts, isPlaying: isPlaying },
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}
const getMovieSchedule = async (cinemaId, movieId) => {
  try {
    const schedules = await scheduleModel.getScheduleByMovieId(movieId)
    const rooms = await roomModel.getByCinemaId(cinemaId)
    const combined = schedules.map((schedule) => {
      const room = rooms.find((room) => room._id.equals(schedule.room_id))
      return {
        ...schedule,
        room_number: room.room_number,
        row: room.row,
        column: room.column,
        seats: room.seats,
      }
    })

    return combined
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}

const getNowPlaying = async () => {
  try {
    let currentSchedules = await scheduleModel.getCurrentSchedule()
    let nowPlayingIds = []
    let nowPlaying = []
    for (let schedule of currentSchedules) {
      if (!nowPlayingIds.includes(String(schedule.movie_id))) {
        nowPlayingIds.push(String(schedule.movie_id))
        const movie = await movieModel.getById(schedule.movie_id)
        nowPlaying.push(movie)
      }
    }
    return { message: 'Lấy dữ liệu thành công', data: nowPlaying }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}
const getComingSoon = async () => {
  try {
    const comingMovies = await movieModel.getComingMovie()
    return { message: 'Lấy dữ liệu thành công', data: comingMovies }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}

const searchMovie = async (searchTerm) => {
  try {
    const movies = await movieModel.searchMovie(searchTerm)
    if (movies.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy phim')
    }
    return { message: 'Lấy dữ liệu thành công', data: movies }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}

export const movieService = {
  addMovie,
  getHomePageData,
  getMovieDetails,
  getMovieSchedule,
  getNowPlaying,
  getComingSoon,
  searchMovie,
}
