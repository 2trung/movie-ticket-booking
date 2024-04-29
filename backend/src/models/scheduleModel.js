import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'

const SCHEDULE_COLLECTION_NAME = 'schedules'
const SCHEDULE_COLLECTION_SCHEMA = Joi.object({
  movie_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  room_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  start_time: Joi.date().timestamp('javascript').required(),
  end_time: Joi.date().timestamp('javascript').required(),
})

const getCurrentSchedule = async () => {
  try {
    const schedules = await GET_DB()
      .collection(SCHEDULE_COLLECTION_NAME)
      .find({ start_time: { $gte: new Date() } })
      .toArray()
    return schedules
  } catch (error) {
    throw new Error(error)
  }
}
const getScheduleByMovieId = async (movieId) => {
  try {
    const schedules = await GET_DB()
      .collection(SCHEDULE_COLLECTION_NAME)
      .find({ movie_id: new ObjectId(String(movieId)) })
      .toArray()
    return schedules
  } catch (error) {
    throw new Error(error)
  }
}

const getScheduleByMovieAndRoom = async (movieId, roomId) => {
  try {
    const schedules = await GET_DB()
      .collection(SCHEDULE_COLLECTION_NAME)
      .find({
        movie_id: new ObjectId(String(movieId)),
        room_id: new ObjectId(String(roomId)),
      })
      .toArray()
    return schedules
  } catch (error) {
    throw new Error(error)
  }
}

export const scheduleModel = {
  getCurrentSchedule,
  getScheduleByMovieId,
  getScheduleByMovieAndRoom,
}
