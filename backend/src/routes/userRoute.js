import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const Router = express.Router()

Router.route('/get-user').get(userController.getUser)
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
Router.route('/resend-otp').post(
  userValidation.resendOtp,
  userController.resendOtp
)

Router.route('/update-profile').put(
  userValidation.updateProfile,
  userController.updateProfile
)

Router.route('/update-avatar').put(
  upload.single('image'),
  userController.updateAvatar
)

export const userRoute = Router
