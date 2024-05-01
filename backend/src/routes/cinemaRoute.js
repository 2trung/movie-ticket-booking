import { cinemaController } from '~/controllers/cinemaController'
import express from 'express'

const Router = express.Router()

Router.get('/all', cinemaController.getAll)
Router.get('/rooms', cinemaController.getRoomsByCinemaId)

export const cinemaRoute = Router
