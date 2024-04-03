import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const addMovie = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(1).max(255).trim().required(),
    description: Joi.string().min(1).trim().required(),
    releaseDate: Joi.date().timestamp('javascript').required(),
    duration: Joi.number().required(),
    genres: Joi.array().items(Joi.string()).required(),
    cast: Joi.array()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      )
      .default([]),
    director: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    trailer: Joi.string().min(1).max(255).trim().required(),
    cens: Joi.string().required(),
    poster: Joi.string().min(1).max(255).trim().required(),
    rating: Joi.number().required(),
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const movieValidation = { addMovie }
