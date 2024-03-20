import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { red, blue, yellow } from '../utils/defaultAvatar'

const defaultAvatar = [red, blue, yellow]
const randomAvatar = () => {
  return defaultAvatar[Math.floor(Math.random() * defaultAvatar.length)]
}

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().min(3).max(50).trim().default(''),
  email: Joi.string().email().required().trim().strict(),
  phone: Joi.string().min(10).max(11).trim().default(''),
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
      .insertOne({ ...validatedData, avatar: randomAvatar() })
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

const updateProfile = async (data) => {
  try {
    const updatedUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { email: data.email },
        { $set: data },
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
  updateProfile,
}
