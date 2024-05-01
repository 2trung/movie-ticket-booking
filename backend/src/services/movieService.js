import { movieModel } from '~/models/movieModel'
import { scheduleModel } from '~/models/scheduleModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { roomModel } from '~/models/roomModel'
import { peopleModel } from '~/models/peopleModel'
import moment from 'moment'

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
const getMovieSchedule = async (movieId) => {
  try {
    // Lấy tất cả các lịch chiếu của phim có id = movieId
    const schedules = await scheduleModel.getScheduleByMovieId(movieId)
    // Lọc các phòng chiếu không trùng nhau
    const rooms = Array.from(
      new Set(schedules.map((schedule) => schedule.room_id))
    )
    // Lấy thông tin của các phòng chiếu
    const cinemaRooms = []
    for (const room of rooms) {
      const roomInfo = await roomModel.getById(room)
      cinemaRooms.push(roomInfo)
    }
    // Gom thông tin lịch chiếu và phòng chiếu lại với nhau
    const schedulesWithCinemaId = schedules.map((schedule) => {
      const room = cinemaRooms.find(
        (room) => String(room._id) === String(schedule.room_id)
      )
      return {
        _id: schedule._id,
        movie_id: schedule.movie_id,
        room_id: schedule.room_id,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        cinema_id: room.cinema_id,
        cinema_name: room.cinema_name,
        cinema_location: room.cinema_location,
      }
    })

    // Biến đổi lịch chiếu theo ngày chiếu, rạp chiếu và giờ chiếu
    const transformedSchedules = []
    schedulesWithCinemaId.forEach((entry) => {
      const startTime = moment(entry.start_time)
      const dateKey = startTime.format('YYYY-MM-DD')

      let existingEntry = transformedSchedules.find(
        (item) => item.date === dateKey
      )
      if (!existingEntry) {
        existingEntry = {
          date: dateKey,
          schedule: [],
        }
        transformedSchedules.push(existingEntry)
      }

      let cinemaEntry = existingEntry.schedule.find(
        (item) => String(item.cinema.cinema_id) === String(entry.cinema_id)
      )
      if (!cinemaEntry) {
        cinemaEntry = {
          cinema: {
            cinema_id: entry.cinema_id,
            cinema_name: entry.cinema_name,
            cinema_location: entry.cinema_location,
          },
          times: [],
        }
        existingEntry.schedule.push(cinemaEntry)
      }

      const startTimeFormatted = startTime.format('HH:mm')
      cinemaEntry.times.push({
        schedule_id: entry._id,
        time: startTimeFormatted,
      })
    })

    return { message: 'Lấy dữ liệu thành công', data: transformedSchedules }
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
        const director = await peopleModel.getById(movie.director)
        let casts = []
        for (let cast of movie.cast) {
          const actor = await peopleModel.getById(cast)
          casts.push(actor)
        }
        nowPlaying.push({
          ...movie,
          director: director,
          cast: casts,
          isPlaying: true,
        })
      }
    }
    return { message: 'Lấy dữ liệu thành công', data: nowPlaying }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}
const getComingSoon = async () => {
  try {
    const comingMovies = []
    const movies = await movieModel.getComingMovie()
    for (let movie of movies) {
      const director = await peopleModel.getById(movie.director)
      let casts = []
      for (let cast of movie.cast) {
        const actor = await peopleModel.getById(cast)
        casts.push(actor)
      }
      comingMovies.push({
        ...movie,
        director: director,
        cast: casts,
        isPlaying: false,
      })
    }
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

const getAllMovies = async () => {
  try {
    const movies = await movieModel.getAll()

    let moviesUpated = []
    for (let movie of movies) {
      let casts = []
      const director = await peopleModel.getById(movie.director)
      for (let cast of movie.cast) {
        const actor = await peopleModel.getById(cast)
        casts.push(actor)
      }
      moviesUpated.push({
        ...movie,
        director: director,
        cast: casts,
      })
    }
    return {
      message: 'Lấy dữ liệu thành công',
      data: moviesUpated,
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}
const update = async (reqBody) => {
  try {
    const updatedMovie = await movieModel.update(reqBody)
    return {
      message: 'Cập nhật thành công!',
      data: updatedMovie,
    }
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
  getAllMovies,
  update,
}
