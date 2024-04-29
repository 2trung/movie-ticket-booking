import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from '~/routes/userRoute'
import { movieRoute } from '~/routes/movieRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'OK' })
})

Router.use('/user', userRoute)

Router.use('/movie', movieRoute)

export const APIs_V1 = Router
