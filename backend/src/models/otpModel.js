import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'

const OTP_COLLECTION_NAME = 'otp'
const OTP_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required().trim().strict(),
  otp: Joi.string().required().min(60).max(72).trim().strict(),
  expTime: Joi.date().timestamp('javascript').default(Date.now()),
})

const createNew = async (data) => {
  try {
    const validatedData = await OTP_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false,
    })
    const otpExist = await GET_DB()
      .collection(OTP_COLLECTION_NAME)
      .findOne({ email: validatedData.email })
    if (otpExist) {
      await GET_DB()
        .collection(OTP_COLLECTION_NAME)
        .updateOne(
          { email: validatedData.email },
          {
            $set: {
              email: validatedData.email,
              otp: validatedData.otp,
              expTime: validatedData.expTime,
            },
          }
        )
      return 'OTP updated'
    }
    await GET_DB().collection(OTP_COLLECTION_NAME).insertOne(validatedData)
  } catch (error) {
    throw new Error(error)
  }
}
const getOtpByEmail = async (email) => {
  try {
    console.log(email)
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
export const otpModel = {
  OTP_COLLECTION_NAME,
  OTP_COLLECTION_SCHEMA,
  createNew,
  getOtpByEmail,
  removeOtp,
}
