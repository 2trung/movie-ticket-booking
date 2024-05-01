import { cinemaModel } from '~/models/cinemaModel'
import { roomModel } from '~/models/roomModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const getAll = async () => {
  try {
    const cinemas = await cinemaModel.getAll()
    return { message: 'Lấy dữ liệu thành công', data: cinemas }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}
const getRoomsByCinemaId = async (reqQuery) => {
  try {
    const rooms = await roomModel.getByCinemaId(reqQuery.cinemaId)
    return { message: 'Lấy dữ liệu thành công', data: rooms }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}
export const cinemaService = { getAll, getRoomsByCinemaId }
