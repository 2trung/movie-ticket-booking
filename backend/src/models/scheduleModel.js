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
  price: Joi.number().required(),
  start_time: Joi.date().timestamp('javascript').required(),
  end_time: Joi.date().timestamp('javascript').required(),
  pending_seats: Joi.array().items(Joi.string()).required(),
  reserved_seats: Joi.array().items(Joi.string()).required(),
})
const INVALID_UPDATE_FIELDS = ['_id']

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
const getById = async (id) => {
  try {
    const schedule = await GET_DB()
      .collection(SCHEDULE_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(String(id)) })
    const newSchedule = await checkPendingSeats(schedule)
    return newSchedule
  } catch (error) {
    throw new Error(error)
  }
}
const updateSchedule = async (id, schedule) => {
  try {
    for (let field of INVALID_UPDATE_FIELDS) {
      if (schedule[field]) {
        delete schedule[field]
      }
    }
    const updatedSchedule = await GET_DB()
      .collection(SCHEDULE_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(String(id)) },
        { $set: schedule },
        { returnDocument: 'after' }
      )
    return updatedSchedule
  } catch (error) {
    throw new Error(error)
  }
}
const checkPendingSeats = async (schedule) => {
  try {
    let pendingSeats = schedule.pending_seats
    for (let pending of schedule.pending_seats) {
      if (pending.expTime < Date.now()) {
        const newPendingSeats = pendingSeats.filter(
          (p) => String(p.order_id) !== String(pending.order_id)
        )
        pendingSeats = newPendingSeats
      }
    }
    const updatedSchedule = await updateSchedule(
      new ObjectId(String(schedule._id)),
      {
        ...schedule,
        pending_seats: pendingSeats,
      }
    )
    return updatedSchedule
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async (page, pageSize) => {
  try {
    const totalItems = await GET_DB()
      .collection(SCHEDULE_COLLECTION_NAME)
      .countDocuments()
    const totalPages = Math.ceil(totalItems / pageSize)
    if (page > totalPages) {
      page = totalPages
    }
    const schedules = await GET_DB()
      .collection(SCHEDULE_COLLECTION_NAME)
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray()
    return { schedules, page, totalPages }
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (schedule) => {
  try {
    const updateData = { ...schedule }
    for (let field of INVALID_UPDATE_FIELDS) {
      delete updateData[field]
    }
    const updatedSchedule = await GET_DB()
      .collection(SCHEDULE_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(String(schedule._id)) },
        { $set: updateData },
        { returnDocument: 'after' }
      )
    return updatedSchedule
  } catch (error) {
    throw new Error(error)
  }
}
const create = async (schedule) => {
  try {
    const updateData = { ...schedule }
    for (let field of INVALID_UPDATE_FIELDS) {
      delete updateData[field]
    }
    const validatedSchedule = await SCHEDULE_COLLECTION_SCHEMA.validateAsync(
      updateData
    )
    const createdSchedule = await GET_DB()
      .collection(SCHEDULE_COLLECTION_NAME)
      .insertOne(validatedSchedule)
    return createdSchedule
  } catch (error) {
    throw new Error(error)
  }
}

export const scheduleModel = {
  getCurrentSchedule,
  getScheduleByMovieId,
  getScheduleByMovieAndRoom,
  getById,
  updateSchedule,
  getAll,
  update,
  create,
}
