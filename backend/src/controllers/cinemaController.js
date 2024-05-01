import { StatusCodes } from 'http-status-codes'
import { cinemaService } from '~/services/cinemaService'

const getAll = async (req, res, next) => {
  try {
    const response = await cinemaService.getAll()
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const getRoomsByCinemaId = async (req, res, next) => {
  try {
    const response = await cinemaService.getRoomsByCinemaId(req.query)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
export const cinemaController = { getAll, getRoomsByCinemaId }
