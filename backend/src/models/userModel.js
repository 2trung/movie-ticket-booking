import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  userName: Joi.string().min(3).max(50).trim().strict(),
  email: Joi.string().email().required().trim().strict(),
  password: Joi.string().required().min(3).max(255).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  isDeleted: Joi.boolean().default(false),
  token: Joi.string().default(null),
  avatar: Joi.string().default(null),
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'token']

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data)
    const emailExist = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ email: validatedData.email })
    if (emailExist) {
      throw new Error('Email already exist!')
    }
    const createdUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validatedData)
    return createdUser
  } catch (error) {
    throw new Error(error)
  }
}

const getByIdId = async (id) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

const getByUserName = async (userName) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ userName: userName })
  } catch (error) {
    throw new Error(error)
  }
}
const getByEmail = async (email) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ email: email })
  } catch (error) {
    throw new Error(error)
  }
}
const updateToken = async (id, token) => {
  try {
    const updatedUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { token: token } },
        { returnDocument: 'after' }
      )
    return updatedUser
  } catch (error) {
    throw new Error(error)
  }
}
const changePassword = async (email, newPassword) => {
  try {
    const updatedUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { email: email },
        { $set: { password: newPassword } },
        { returnDocument: 'after' }
      )
    return updatedUser
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (email, data) => {
  try {
    const updateData = { ...data }
    INVALID_UPDATE_FIELDS.forEach((field) => {
      delete updateData[field]
    })
    const updatedUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { email: email },
        { $set: { ...updateData, updatedAt: Date.now() } },
        { returnDocument: 'after' }
      )
    return updatedUser
  } catch (error) {
    throw new Error(error)
  }
}
const updateAvatar = async (email, avatar) => {
  try {
    const updatedUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { email: email },
        { $set: { avatar: avatar, updatedAt: Date.now() } },
        { returnDocument: 'after' }
      )
    return updatedUser
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  getByIdId,
  getByUserName,
  getByEmail,
  updateToken,
  changePassword,
  updateAvatar,
}
