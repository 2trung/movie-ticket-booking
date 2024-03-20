import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'

const OTP_COLLECTION_NAME = 'otp'
const OTP_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required().trim().strict(),
  otp: Joi.string().required().min(60).max(72).trim().strict(),
  expTime: Joi.date().timestamp('javascript').default(Date.now()),
  resendTime: Joi.date().timestamp('javascript').default(Date.now()),
  isVerify: Joi.boolean().default(false),
})

const setOtp = async (data) => {
  try {
    const validatedData = await OTP_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false,
    })
    const otpExist = await GET_DB()
      .collection(OTP_COLLECTION_NAME)
      .findOne({ email: validatedData.email })
    if (otpExist) {
      return await GET_DB()
        .collection(OTP_COLLECTION_NAME)
        .updateOne(
          { email: validatedData.email },
          {
            $set: {
              email: validatedData.email,
              otp: validatedData.otp,
              expTime: validatedData.expTime,
              resendTime: validatedData.resendTime,
            },
          }
        )
    }
    return await GET_DB()
      .collection(OTP_COLLECTION_NAME)
      .insertOne(validatedData)
  } catch (error) {
    throw new Error(error)
  }
}
const getOtpByEmail = async (email) => {
  try {
    return await GET_DB()
      .collection(OTP_COLLECTION_NAME)
      .findOne({ email: email })
  } catch (error) {
    throw new Error(error)
  }
}

const removeOtp = async (email) => {
  try {
    await GET_DB().collection(OTP_COLLECTION_NAME).deleteOne({ email: email })
  } catch (error) {
    throw new Error(error)
  }
}

const updateOtpStatus = async (email, isVerify, expTime) => {
  try {
    await GET_DB()
      .collection(OTP_COLLECTION_NAME)
      .updateOne(
        { email: email },
        {
          $set: {
            isVerify: isVerify,
            expTime: expTime,
          },
        }
      )
  } catch (error) {
    throw new Error(error)
  }
}

export const otpModel = {
  OTP_COLLECTION_NAME,
  OTP_COLLECTION_SCHEMA,
  getOtpByEmail,
  removeOtp,
  setOtp,
  updateOtpStatus,
}
