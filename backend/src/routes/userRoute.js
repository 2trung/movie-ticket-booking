import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'

const Router = express.Router()

Router.route('/signup').post(userValidation.signUp, userController.signUp)
Router.route('/login').post(userValidation.login, userController.login)
Router.route('/change-password').put(
  userValidation.changePassword,
  userController.changePassword
)
Router.route('/forget-password').post(
  userValidation.forgetPassword,
  userController.forgetPassword
)
Router.route('/verify-otp').post(
  userValidation.verifyOtp,
  userController.verifyOtp
)
Router.route('/reset-password').put(
  userValidation.resetPassword,
  userController.resetPassword
)

export const userRoute = Router
