import { env } from '~/config/environment'
import { userModel } from '~/models/userModel'
import { otpModel } from '~/models/otpModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mg from 'mailgun-js'

const generateOtp = () => {
  let otp = Math.floor(0 + Math.random() * 9000)
  return otp.toString().padStart(4, '0')
}
const sendOtp = async (email, otp) => {
  const mailGun = () =>
    mg({
      apiKey: env.MAILGUN_API_KEY,
      domain: env.MAILGUN_DOMAIN,
    })

  mailGun()
    .messages()
    .send(
      {
        from: 'Movie ticket booking <no-reply@ticket.com>',
        to: email,
        subject: 'Verify your Email',
        text: `Mã OTP của bạn là ${otp}`,
      },
      (error) => {
        if (error) {
          throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Email không thể gửi'
          )
        }
      }
    )
}

const getUser = async (accessToken) => {
  try {
    const user = jwt.verify(accessToken, env.JWT_SECRET)
    if (!user)
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token không hợp lệ')

    const userInfo = await userModel.getByEmail(user.email)
    if (!userInfo)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng')
    return {
      email: userInfo.email,
      accessToken: userInfo.token,
      avatar: userInfo.avatar,
      name: userInfo.name,
      phone: userInfo.phone,
    }
  } catch (error) {
    throw error
  }
}

const signUp = async (reqBody) => {
  try {
    const hashPassword = bcrypt.hashSync(reqBody.password, 10)
    const createdUser = await userModel.createNew({
      email: reqBody.email,
      password: hashPassword,
    })
    const newUser = await userModel.getByIdId(createdUser.insertedId)
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
      },
      env.JWT_SECRET
    )
    const authUser = await userModel.updateToken(newUser._id, token)
    return {
      message: 'Đăng ký thành công',
      data: { email: authUser.email, accessToken: token },
    }
  } catch (error) {
    throw error
  }
}
const login = async (reqBody) => {
  try {
    const user = await userModel.getByEmail(reqBody.email)
    if (!user)
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Email hoặc mật khẩu không chính xác'
      )

    const isPasswordMatch = bcrypt.compareSync(reqBody.password, user.password)
    if (!isPasswordMatch || !user)
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Email hoặc mật khẩu không chính xác'
      )

    const token = jwt.sign(
      { id: user._id, userName: user.userName, email: user.email },
      env.JWT_SECRET
    )
    const authUser = await userModel.updateToken(user._id, token)
    return {
      message: 'Đăng nhập thành công',
      data: {
        email: authUser.email,
        accessToken: authUser.token,
        avatar: authUser.avatar,
        name: authUser.name,
        phone: authUser.phone,
      },
    }
  } catch (error) {
    throw error
  }
}
const changePassword = async (accessToken, oldPassword, newPassword) => {
  try {
    const email = jwt.verify(accessToken, env.JWT_SECRET).email
    if (!email)
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token không hợp lệ')
    const hashPassword = bcrypt.hashSync(newPassword, 10)

    const user = await userModel.getByEmail(email)
    if (!user)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng')
    const isPasswordMatch = bcrypt.compareSync(oldPassword, user.password)
    if (!isPasswordMatch)
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Mật khẩu cũ không chính xác'
      )
    if (oldPassword === newPassword)
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        'Mật khẩu mới phải khác mật khẩu cũ'
      )
    const updatedUser = await userModel.changePassword(email, hashPassword)
    return { message: 'Cập nhật mật khẩu thành công' }
  } catch (error) {
    throw error
  }
}

const forgetPassword = async (email) => {
  try {
    const user = await userModel.getByEmail(email)
    if (!user)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng')
    const otp = generateOtp()
    const expTime = new Date().getTime() + 5 * 60 * 1000
    const resendTime = new Date().getTime() + 1 * 60 * 1000
    const hashOtp = bcrypt.hashSync(otp.toString(), 10)
    await otpModel.setOtp({
      email,
      otp: hashOtp,
      expTime,
      resendTime: resendTime,
    })

    await sendOtp(email, otp)

    return { message: 'OTP đã được gửi đến email', data: { email: email } }
  } catch (error) {
    throw error
  }
}

const verifyOtp = async (email, otp) => {
  const userOtp = await otpModel.getOtpByEmail(email)
  if (!userOtp) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy OTP')
  if (!bcrypt.compareSync(otp, userOtp.otp))
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'OTP không hợp lệ')
  if (userOtp.expTime < new Date().getTime())
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'OTP hết hạn')

  const expTime = new Date().getTime() + 1 * 60 * 1000
  await otpModel.updateOtpStatus(email, true, expTime)
  return {
    message: 'Đã xác nhận OTP',
    data: { email: email },
  }
}

const resendOtp = async (email) => {
  const user = await userModel.getByEmail(email)
  if (!user)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng')
  const userOtp = await otpModel.getOtpByEmail(email)
  if (userOtp && userOtp.resendTime > new Date().getTime()) {
    const remainMinutes = Math.floor(
      (userOtp.resendTime - new Date().getTime()) / 1000
    )
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      'Bạn chỉ có thể gửi lại otp sau ' + remainMinutes + ' giây'
    )
  }
  const otp = generateOtp()
  const expTime = new Date().getTime() + 5 * 60 * 1000
  const resendTime = new Date().getTime() + 1 * 60 * 1000
  const hashOtp = bcrypt.hashSync(otp.toString(), 10)
  await otpModel.setOtp({
    email: email,
    otp: hashOtp,
    expTime: expTime,
    resendTime: resendTime,
  })
  await otpModel.updateOtpStatus(email, false, expTime)
  await sendOtp(email, otp)
  return { message: 'OTP đã được gửi đến email', data: { email: email } }
}

const resetPassword = async (email, newPassword) => {
  const userOtp = await otpModel.getOtpByEmail(email)
  if (!userOtp)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Gửi OTP trước khi đặt lại mật khẩu'
    )
  if (userOtp.expTime < new Date().getTime())
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'OTP hết hạn')
  if (!userOtp.isVerify)
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'OTP chưa được xác nhận')

  const hashPassword = bcrypt.hashSync(newPassword, 10)

  const updatedUser = await userModel.changePassword(email, hashPassword)

  otpModel.removeOtp(email)
  return { message: 'Đã cập nhật mật khẩu mới', email: updatedUser.email }
}

const updateProfile = async (accessToken, reqBody) => {
  try {
    const email = jwt.verify(accessToken, env.JWT_SECRET).email
    if (!email)
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token không hợp lệ')
    const updatedUser = await userModel.updateProfile(reqBody)
    return {
      message: 'Cập nhật thông tin thành công',
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        accessToken: updatedUser.token,
      },
    }
  } catch (error) {
    throw error
  }
}
const updateAvatar = async (accessToken, avatar) => {
  try {
    const email = jwt.verify(accessToken, env.JWT_SECRET).email
    if (!email)
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token không hợp lệ')
    const avataBase64 = avatar.buffer.toString('base64')
    const updatedUser = await userModel.updateProfile({
      email: email,
      avatar: avataBase64,
    })
    return { message: 'Avatar updated' }
  } catch (error) {
    throw error
  }
}

export const userService = {
  signUp,
  login,
  changePassword,
  forgetPassword,
  verifyOtp,
  resendOtp,
  resetPassword,
  getUser,
  updateProfile,
  updateAvatar,
}
