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

const getUser = async (_id) => {
  try {
    const user = await userModel.getById(_id)
    return {
      email: user.email,
      name: user.name,
      phone: user.phone,
      accessToken: user.accessToken,
      refeshToken: user.refreshToken,
      avatar: user.avatar,
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
    const newUser = await userModel.getById(createdUser.insertedId)
    return {
      message: 'Đăng ký thành công',
      data: { _id: newUser._id, email: newUser.email },
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

    const accessToken = jwt.sign(
      { _id: user._id, email: user.email },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    )
    const refreshToken = jwt.sign(
      { _id: user._id, email: user.email },
      env.REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' }
    )

    const authUser = await userModel.updateToken(user._id, {
      accessToken,
      refreshToken,
    })
    return {
      message: 'Đăng nhập thành công',
      data: {
        _id: authUser._id,
        email: authUser.email,
        name: authUser.name,
        phone: authUser.phone,
        accessToken: authUser.accessToken,
        refreshToken: authUser.refreshToken,
        avatar: authUser.avatar,
      },
    }
  } catch (error) {
    throw error
  }
}

const changePassword = async (_id, oldPassword, newPassword) => {
  try {
    const user = await userModel.getByIdId(_id)

    if (!user)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng')

    const hashPassword = bcrypt.hashSync(newPassword, 10)
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
    const updatedUser = await userModel.changePassword(_id, hashPassword)
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

  const user = await userModel.getByEmail(email)
  const hashPassword = bcrypt.hashSync(newPassword, 10)

  const updatedUser = await userModel.changePassword(user._id, hashPassword)
  otpModel.removeOtp(email)
  return { message: 'Đã cập nhật mật khẩu mới', email: updatedUser.email }
}

const updateProfile = async (_id, reqBody) => {
  try {
    const updatedUser = await userModel.updateProfile(_id, {
      ...reqBody,
      updatedAt: Date.now(),
    })
    return {
      message: 'Cập nhật thông tin thành công',
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        accessToken: updatedUser.accessToken,
        refeshToken: updatedUser.refreshToken,
      },
    }
  } catch (error) {
    throw error
  }
}
const updateAvatar = async (_id, avatar) => {
  try {
    const avataBase64 = avatar.buffer.toString('base64')
    const updatedUser = await userModel.updateProfile(_id, {
      avatar: avataBase64,
      updatedAt: Date.now(),
    })
    return { message: 'Avatar updated' }
  } catch (error) {
    throw error
  }
}

const refreshToken = async (_id, email) => {
  const accessToken = jwt.sign(
    { _id: _id, email: email },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' }
  )
  const refreshToken = jwt.sign(
    { _id: _id, email: email },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  )
  const authUser = await userModel.updateToken(_id, {
    accessToken,
    refreshToken,
  })
  return {
    accessToken: authUser.accessToken,
    refreshToken: authUser.refreshToken,
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
  refreshToken,
}
