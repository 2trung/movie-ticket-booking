import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import {
  verifyAccessToken,
  verifyRefreshToken,
} from '~/middlewares/authMiddleware'
import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const Router = express.Router()

Router.route('/signup').post(userValidation.signUp, userController.signUp)
Router.route('/login').post(userValidation.login, userController.login)

Router.route('/get-user').get(verifyAccessToken, userController.getUser)
Router.route('/change-password').put(
  verifyAccessToken,
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
Router.route('/resend-otp').post(
  userValidation.resendOtp,
  userController.resendOtp
)

Router.route('/update-profile').put(
  verifyAccessToken,
  userValidation.updateProfile,
  userController.updateProfile
)

Router.route('/update-avatar').put(
  verifyAccessToken,
  upload.single('image'),
  userController.updateAvatar
)

Router.route('/refresh-token').post(
  verifyRefreshToken,
  userController.refreshToken
)

export const userRoute = Router
