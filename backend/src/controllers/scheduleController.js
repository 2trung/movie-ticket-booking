import { StatusCodes } from 'http-status-codes'
import { scheduleService } from '~/services/scheduleService'

const getScheduleDetails = async (req, res, next) => {
  try {
    const response = await scheduleService.getScheduleDetails(req.query.id)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const getAll = async (req, res, next) => {
  try {
    const response = await scheduleService.getAll(req.query)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const update = async (req, res, next) => {
  try {
    const response = await scheduleService.update(req.body)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const create = async (req, res, next) => {
  try {
    const response = await scheduleService.create(req.body)
    res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    next(error)
  }
}
export const scheduleController = {
  getScheduleDetails,
  getAll,
  update,
  create,
}
