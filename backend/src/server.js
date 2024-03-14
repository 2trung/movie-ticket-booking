import express from 'express'
const swaggerUi = require('swagger-ui-express')
const specs = require('./swagger')
import cors from 'cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB, GET_DB } from './config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  app.use(express.json())
  app.use(cors())

  app.use('/', APIs_V1)
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs))

  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server runing  at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

  exitHook(() => {
    console.log('Server is shutting down...')
    CLOSE_DB()
  })
}

;(async () => {
  try {
    console.log('Connecting to MongoDB...')
    await CONNECT_DB()
    console.log('Connected to MongoDB')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
