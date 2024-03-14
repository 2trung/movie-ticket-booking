import { slugify } from '~/utils/formatter'
import { env } from '~/config/environment'
import { userModel } from '~/models/userModel'
import { otpModel } from '~/models/otpModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { cloneDeep } from 'lodash'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mg from 'mailgun-js'

const mailGun = () =>
  mg({
    apiKey: env.MAILGUN_API_KEY,
    domain: env.MAILGUN_DOMAIN,
  })

const signUp = async (reqBody) => {
  try {
    const hashPassword = bcrypt.hashSync(reqBody.password, 10)
    reqBody.password = hashPassword
    const createdUser = await userModel.createNew(reqBody)
    const newUser = await userModel.getByIdId(createdUser.insertedId)
    const token = jwt.sign(
      {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
      },
      env.JWT_SECRET
    )
    const authUser = await userModel.updateToken(newUser._id, token)
    return { message: 'User created', email: authUser.email, accesToken: token }
  } catch (error) {
    throw error
  }
}
const login = async (reqBody) => {
  try {
    const user = await userModel.getByEmail(reqBody.email)

    const isPasswordMatch = bcrypt.compareSync(reqBody.password, user.password)
    if (!isPasswordMatch || !user)
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password!')

    const token = jwt.sign(
      { id: user._id, userName: user.userName, email: user.email },
      env.JWT_SECRET
    )
    const authUser = await userModel.updateToken(user._id, token)
    return { email: authUser.email, accesToken: authUser.token }
  } catch (error) {
    throw error
  }
}
const changePassword = async (email, newPassword) => {
  try {
    const hashPassword = bcrypt.hashSync(newPassword, 10)
    const updatedUser = await userModel.changePassword(email, hashPassword)
    return updatedUser
  } catch (error) {
    throw error
  }
}

const forgetPassword = async (email) => {
  try {
    const user = await userModel.getByEmail(email)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    // random opt
    const otp = Math.floor(1000 + Math.random() * 9000)
    // exp time = 5 minutes
    const expTime = new Date().getTime() + 5 * 60 * 1000
    const hashOtp = bcrypt.hashSync(otp.toString(), 10)
    await otpModel.createNew({ email, otp: hashOtp, expTime })

    // send otp to user email
    mailGun()
      .messages()
      .send(
        {
          from: 'Movie ticket booking <no-reply@ticket.com>',
          to: email,
          subject: 'Verify your Email',
          text: `Your OTP is ${otp}`,
        },
        (error, body) => {
          if (error) {
            throw new ApiError(
              StatusCodes.INTERNAL_SERVER_ERROR,
              'Email not sent'
            )
          }
        }
      )
    const token = jwt.sign({ email: user.email }, env.JWT_SECRET)
    userModel.updateToken(user._id, token)
    return { message: 'OTP sent to your email', accesToken: token }
  } catch (error) {
    throw error
  }
}
const verifyOtp = async (accesToken, otp) => {
  const email = jwt.verify(accesToken, env.JWT_SECRET).email
  const userOtp = await otpModel.getOtpByEmail(email)
  console.log(userOtp)
  if (!userOtp) throw new ApiError(StatusCodes.NOT_FOUND, 'OTP not found')
  if (!bcrypt.compareSync(otp, userOtp.otp))
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid OTP')
  if (userOtp.expTime < new Date().getTime())
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'OTP expired')
  const token = jwt.sign({ email: email, otpVerify: true }, env.JWT_SECRET)
  const user = await userModel.getByEmail(email)
  await userModel.updateToken(user._id, token)
  otpModel.removeOtp(email)
  return { message: 'OTP verified', accesToken: token }
}
const resetPassword = async (accesToken, newPassword) => {
  const isOtpVerified = jwt.verify(accesToken, env.JWT_SECRET).otpVerify
  if (!isOtpVerified)
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'OTP not verified')
  const email = jwt.verify(accesToken, env.JWT_SECRET).email
  const hashPassword = bcrypt.hashSync(newPassword, 10)
  const updatedUser = await userModel.changePassword(email, hashPassword)
  return { message: 'Password updated', email: updatedUser.email }
}

export const userService = {
  signUp,
  login,
  changePassword,
  forgetPassword,
  verifyOtp,
  resetPassword,
}
