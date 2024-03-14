import { StatusCodes } from 'http-status-codes'
// import ApiError from '~/utils/ApiError'
import { userService } from '~/services/userService'

const signUp = async (req, res, next) => {
  try {
    const createNewUser = await userService.signUp(req.body)
    res.status(StatusCodes.CREATED).json(createNewUser)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const user = await userService.login(req.body)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}
const changePassword = async (req, res, next) => {
  try {
    const updatedUser = await userService.changePassword(
      req.body.email,
      req.body.newPassword
    )
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) {
    next(error)
  }
}

const forgetPassword = async (req, res, next) => {
  try {
    const updatedUser = await userService.forgetPassword(req.body.email)
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) {
    next(error)
  }
}
const verifyOtp = async (req, res, next) => {
  try {
    const accesToken = req.headers.authorization.split(' ')[1]
    const updatedUser = await userService.verifyOtp(accesToken, req.body.otp)
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) {
    next(error)
  }
}
const resetPassword = async (req, res, next) => {
  try {
    const accesToken = req.headers.authorization.split(' ')[1]
    const updatedUser = await userService.resetPassword(
      accesToken,
      req.body.newPassword
    )
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  signUp,
  login,
  changePassword,
  forgetPassword,
  verifyOtp,
  resetPassword,
}
