import { StatusCodes } from 'http-status-codes'
import { movieService } from '~/services/movieService'

const addMovie = async (req, res, next) => {
  try {
    const response = await movieService.addMovie(req.body)
    res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    next(error)
  }
}
const getHomePageData = async (req, res, next) => {
  try {
    const response = await movieService.getHomePageData()
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const getMovieDetails = async (req, res, next) => {
  try {
    const response = await movieService.getMovieDetails(req.query.movieId)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const getMovieSchedule = async (req, res, next) => {
  try {
    const response = await movieService.getMovieSchedule(
      req.query.cinemaId,
      req.query.movieId
    )
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const getNowPlaying = async (req, res, next) => {
  try {
    const response = await movieService.getNowPlaying()
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const getComingSoon = async (req, res, next) => {
  try {
    const response = await movieService.getComingSoon()
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const searchMovie = async (req, res, next) => {
  try {
    const response = await movieService.searchMovie(req.query.query)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

export const movieController = {
  addMovie,
  getHomePageData,
  getMovieDetails,
  getMovieSchedule,
  getNowPlaying,
  getComingSoon,
  searchMovie,
}
