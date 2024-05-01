import { env } from '~/config/environment'
import { scheduleModel } from '~/models/scheduleModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { roomModel } from '~/models/roomModel'
import { movieModel } from '~/models/movieModel'
import { cinemaModel } from '~/models/cinemaModel'

const getScheduleDetails = async (id) => {
  try {
    const schedules = await scheduleModel.getById(id)
    const rooms = await roomModel.getById(schedules.room_id)
    return {
      message: 'Lấy dữ liệu thành công',
      data: { ...schedules, room: rooms },
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}
const getAll = async (reqQuery) => {
  try {
    const response = await scheduleModel.getAll(
      parseInt(reqQuery.page),
      parseInt(reqQuery.pageSize)
    )
    let schedulesUpdated = []
    for (let schedule of response.schedules) {
      const room = await roomModel.getById(schedule.room_id)
      const movie = await movieModel.getById(schedule.movie_id)
      schedulesUpdated.push({
        ...schedule,
        cinema_id: room.cinema_id,
        cinema_name: room.cinema_name,
        room_number: room.room_number,
        movie_name: movie.title,
        total_seats: room.row * room.column,
      })
    }
    return {
      message: 'Lấy dữ liệu thành công',
      data: { ...response, schedules: schedulesUpdated },
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}
const update = async (reqBody) => {
  try {
    const updatedSchedule = await scheduleModel.update(reqBody)
    return { message: 'Cập nhật thành công', data: updatedSchedule }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}
const create = async (reqBody) => {
  try {
    const newSchedule = await scheduleModel.create(reqBody)
    return { message: 'Tạo mới thành công', data: newSchedule }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}
export const scheduleService = {
  getScheduleDetails,
  getAll,
  update,
  create,
}
