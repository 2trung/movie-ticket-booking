import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const signUp = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required().trim().strict(),
    password: Joi.string().required().min(6).max(50).trim().strict(),
    confirmation: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .messages({ 'any.only': 'Password confirmation does not match' }),
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}
const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required().trim().strict(),
    password: Joi.string().required().min(6).max(50).trim().strict(),
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const changePassword = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required().trim().strict(),
    oldPassword: Joi.string().required().min(6).max(50).trim().strict(),
    newPassword: Joi.string().required().min(6).max(50).trim().strict(),
    confirmation: Joi.any()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({ 'any.only': 'Password confirmation does not match' }),
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const forgetPassword = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required().trim().strict(),
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const verifyOtp = async (req, res, next) => {
  const correctCondition = Joi.object({
    otp: Joi.string().required().min(4).max(6).trim().strict(),
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}
const resetPassword = async (req, res, next) => {
  const correctCondition = Joi.object({
    newPassword: Joi.string().required().min(6).max(50).trim().strict(),
    confirmation: Joi.any()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({ 'any.only': 'Password confirmation does not match' }),
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateAvatar = async (req, res, next) => {
  const correctCondition = Joi.object({
    avatar: Joi.any().required(),
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const userValidation = {
  signUp,
  login,
  changePassword,
  forgetPassword,
  verifyOtp,
  resetPassword,
}
