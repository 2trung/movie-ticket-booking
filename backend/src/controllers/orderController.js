import { StatusCodes } from 'http-status-codes'
import { orderService } from '~/services/orderService'

const createOrder = async (req, res, next) => {
  try {
    const response = await orderService.createOrder(
      req.user,
      req.body.schedule_id,
      req.body.seats
    )
    res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    next(error)
  }
}
const vnpReturn = async (req, res, next) => {
  try {
    const response = await orderService.vnpReturn(
      req.query,
      req._parsedUrl.query
    )
    res.status(StatusCodes.OK).send(response)
  } catch (error) {
    next(error)
  }
}
const getOrderByUserId = async (req, res, next) => {
  try {
    const response = await orderService.getOrderByUserId(req.user)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const getTicketsByUserId = async (req, res, next) => {
  try {
    const response = await orderService.getTicketsByUserId(req.user)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const getTicketDetail = async (req, res, next) => {
  try {
    const response = await orderService.getTicketDetail(req.query.orderId)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const getOrderDetail = async (req, res, next) => {
  try {
    const response = await orderService.getOrderDetail(
      req.user,
      req.query.orderId
    )
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const cancelOrder = async (req, res, next) => {
  try {
    const response = await orderService.cancelOrder(
      req.user._id,
      req.query.orderId
    )
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

export const orderController = {
  createOrder,
  vnpReturn,
  getOrderByUserId,
  getTicketsByUserId,
  getTicketDetail,
  getOrderDetail,
  cancelOrder,
}
