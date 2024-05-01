import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from '~/routes/userRoute'
import { movieRoute } from '~/routes/movieRoute'
import { scheduleRoute } from '~/routes/scheduleRoute'
import { orderRoute } from '~/routes/orderRoute'
import { vnpayRoute } from '~/routes/vnpayRoute'
import { peopleRoute } from '~/routes/peopleRoute'
import { cinemaRoute } from '~/routes/cinemaRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'OK' })
})

Router.use('/user', userRoute)

Router.use('/movie', movieRoute)
Router.use('/schedule', scheduleRoute)
Router.use('/order', orderRoute)
Router.use('/vnpay', vnpayRoute)
Router.use('/people', peopleRoute)
Router.use('/cinema', cinemaRoute)

export const APIs_V1 = Router
