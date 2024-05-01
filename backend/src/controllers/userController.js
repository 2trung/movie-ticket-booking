import { StatusCodes } from 'http-status-codes'
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
    const response = await userService.changePassword(
      req.user._id,
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
    const response = await userService.getUser(req.user._id)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const response = await userService.updateProfile(
      req.user._id,
      req.file,
      req.body
    )
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const updateAvatar = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateAvatar(req.user._id, req.file)
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const response = await userService.refreshToken(
      req.user._id,
      req.user.email
    )
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const getAll = async (req, res, next) => {
  try {
    const response = await userService.getAll(req.query)
    res.status(StatusCodes.OK).json(response)
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
  refreshToken,
  getAll,
}
