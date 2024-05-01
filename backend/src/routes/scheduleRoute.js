import express from 'express'
import { movieValidation } from '~/validations/movieValidation'
import { scheduleController } from '~/controllers/scheduleController'

import { verifyAccessToken } from '~/middlewares/authMiddleware'
import { movieService } from '~/services/movieService'

const Router = express.Router()

Router.get('/', scheduleController.getScheduleDetails)
Router.get('/all', scheduleController.getAll)
Router.put('/update', scheduleController.update)
Router.post('/create', scheduleController.create)

export const scheduleRoute = Router
