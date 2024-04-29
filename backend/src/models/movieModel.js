import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'

const MOVIE_COLLECTION_NAME = 'movies'
const MOVIE_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().min(1).max(255).trim().required(),
  description: Joi.string().min(1).trim().required(),
  releaseDate: Joi.date().timestamp('javascript').required(),
  duration: Joi.number().required(),
  genres: Joi.array().items(Joi.string()).required(),
  cast: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  director: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  trailer: Joi.string().min(1).max(255).trim().required(),
  cens: Joi.string().required(),
  poster: Joi.string().min(1).max(255).trim().required(),
  rating: Joi.number().required(),
})

const validateBeforeCreate = async (data) => {
  return await MOVIE_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  })
}

const addMovie = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data)
    if (validatedData.cast) {
      validatedData.cast = validatedData.cast.map(
        (cast) => new ObjectId(String(cast))
      )
    }
    if (validatedData.director)
      validatedData.director = new ObjectId(String(validatedData.director))

    const createdUser = await GET_DB()
      .collection(MOVIE_COLLECTION_NAME)
      .insertOne(validatedData)
    return createdUser
  } catch (error) {
    throw new Error(error)
  }
}

const getComingMovie = async () => {
  try {
    const comingMovies = await GET_DB()
      .collection(MOVIE_COLLECTION_NAME)
      .find({ releaseDate: { $gte: new Date() } })
      .toArray()
    return comingMovies
  } catch (error) {
    throw new Error(error)
  }
}
const getById = async (_id) => {
  try {
    const movie = await GET_DB()
      .collection(MOVIE_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(String(_id)) })
    return movie
  } catch (error) {
    throw new Error(error)
  }
}

const searchMovie = async (searchTerm) => {
  try {
    const movies = await GET_DB()
      .collection(MOVIE_COLLECTION_NAME)
      .find({ title: { $regex: searchTerm, $options: 'i' } })
      .toArray()
    return movies
  } catch (error) {
    throw new Error(error)
  }
}

export const movieModel = { addMovie, getComingMovie, getById, searchMovie }
