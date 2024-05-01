import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'
import { cinemaModel } from './cinemaModel'

const ROOM_COLLECTION_NAME = 'rooms'
const ROOM_COLLECTION_SCHEMA = Joi.object({
  room_number: Joi.string().required(),
  cinema_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  row: Joi.number().required(),
  column: Joi.number().required(),
  seats: Joi.array().items(Joi.string()).required(),
})

const getById = async (_id) => {
  try {
    const room = await GET_DB()
      .collection(ROOM_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(String(_id)) })
    const cinema = await cinemaModel.getById(room.cinema_id)
    return {
      ...room,
      cinema_name: cinema.name,
      cinema_location: cinema.location,
    }
  } catch (error) {
    throw new Error(error)
  }
}
const getByCinemaId = async (cinemaId) => {
  try {
    const rooms = await GET_DB()
      .collection(ROOM_COLLECTION_NAME)
      .find({ cinema_id: new ObjectId(String(cinemaId)) })
      .toArray()
    return rooms
  } catch (error) {
    throw new Error(error)
  }
}
const getByMovieId = async (movieId) => {
  try {
    const schedules = await GET_DB()
      .collection('schedules')
      .find({ movie_id: new ObjectId(String(movieId)) })
      .toArray()
    let rooms = []
    for (let schedule of schedules) {
      const room = await getById(schedule.room_id)
      rooms.push(room)
    }
    return rooms
  } catch (error) {
    throw new Error(error)
  }
}

export const roomModel = { getById, getByCinemaId, getByMovieId }
