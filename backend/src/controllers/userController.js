import { StatusCodes } from 'http-status-codes'
// import ApiError from '~/utils/ApiError'
import { userService } from '~/services/userService'

const signUp = async (req, res, next) => {
  try {
    const response = await userService.signUp(req.body)
    res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const response = await userService.login(req.body)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const changePassword = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1]
    const response = await userService.changePassword(
      accessToken,
      req.body.oldPassword,
      req.body.newPassword
    )
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const forgetPassword = async (req, res, next) => {
  try {
    const response = await userService.forgetPassword(req.body.email)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const verifyOtp = async (req, res, next) => {
  try {
    const response = await userService.verifyOtp(req.body.email, req.body.otp)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const resetPassword = async (req, res, next) => {
  try {
    const response = await userService.resetPassword(
      req.body.email,
      req.body.newPassword
    )
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const resendOtp = async (req, res, next) => {
  try {
    const response = await userService.resendOtp(req.body.email)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const getUser = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1]
    const response = await userService.getUser(accessToken)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1]
    const response = await userService.updateProfile(accessToken, req.body)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const updateAvatar = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1]
    const updatedUser = await userService.updateAvatar(accessToken, req.file)
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
  resendOtp,
  getUser,
  updateProfile,
  updateAvatar,
}
