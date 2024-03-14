import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from '~/routes/userRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'OK' })
})

Router.use('/user', userRoute)

export const APIs_V1 = Router
