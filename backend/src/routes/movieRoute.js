import express from 'express'
import { movieValidation } from '~/validations/movieValidation'
import { movieController } from '~/controllers/movieController'
import { verifyAccessToken } from '~/middlewares/authMiddleware'
import { movieService } from '~/services/movieService'

const Router = express.Router()

Router.get('/home', verifyAccessToken, movieController.getHomePageData)
Router.get('/', verifyAccessToken, movieController.getMovieDetails)
Router.get('/schedule', verifyAccessToken, movieController.getMovieSchedule)
Router.get('/now-playing', verifyAccessToken, movieController.getNowPlaying)
Router.get('/coming-soon', verifyAccessToken, movieController.getComingSoon)
Router.get('/search', movieController.searchMovie)

export const movieRoute = Router
