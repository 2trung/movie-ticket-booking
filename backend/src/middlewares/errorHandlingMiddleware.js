/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
export const errorHandlingMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack,
  }

  res.status(responseError.statusCode).json(responseError)
}
