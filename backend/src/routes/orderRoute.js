import express from 'express'
import { orderValidation } from '~/validations/orderValidation'
import { movieController } from '~/controllers/movieController'
import { verifyAccessToken } from '~/middlewares/authMiddleware'
import { orderController } from '~/controllers/orderController'

const Router = express.Router()

Router.post('/create', verifyAccessToken, orderController.createOrder)
// Router.put('/update', orderValidation.updateOrder, orderController.updateOrder)
Router.get('/vnpay-return', orderController.vnpReturn)
Router.get('/get-orders', verifyAccessToken, orderController.getOrderByUserId)
Router.get(
  '/get-tickets',
  verifyAccessToken,
  orderController.getTicketsByUserId
)
Router.get(
  '/get-ticket-detail',
  verifyAccessToken,
  orderController.getTicketDetail
)
Router.get(
  '/get-order-detail',
  verifyAccessToken,
  orderController.getOrderDetail
)
Router.put('/cancel', verifyAccessToken, orderController.cancelOrder)

export const orderRoute = Router
