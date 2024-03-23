import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(StatusCodes.UNAUTHORIZED)
  jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token hết hạn')
      }
      throw new ApiError(StatusCodes.FORBIDDEN, 'Token không hợp lệ')
    }
    req.user = user
    next()
  })
}
export const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken
  if (refreshToken == null) return res.sendStatus(StatusCodes.UNAUTHORIZED)

  jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Phiên đăng nhập hết hạn')
      }
      throw new ApiError(StatusCodes.FORBIDDEN, 'Token không hợp lệ')
    }
    req.user = user
    next()
  })
}
