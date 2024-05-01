import express from 'express'
import { peopleController } from '~/controllers/peopleController'

const Router = express.Router()
Router.get('/all', peopleController.getAll)
Router.get('/search', peopleController.search)
Router.get('/:id', peopleController.getDetail)
Router.post('/create', peopleController.create)
Router.put('/update', peopleController.update)

export const peopleRoute = Router
