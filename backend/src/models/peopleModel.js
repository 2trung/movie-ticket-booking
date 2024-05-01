import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const PEOPLE_COLLECTION_NAME = 'people'
const PEOPLE_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().min(1).max(255).trim().required(),
  photo: Joi.string().min(1).max(255).trim().required(),
})
const INVALID_UPDATE_FIELDS = ['_id']

const getById = async (_id) => {
  try {
    const people = await GET_DB()
      .collection(PEOPLE_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(String(_id)) })
    return people
  } catch (error) {
    throw new Error(error)
  }
}
const getAll = async (page, pageSize) => {
  try {
    const totalItems = await GET_DB()
      .collection(PEOPLE_COLLECTION_NAME)
      .countDocuments()
    const totalPages = Math.ceil(totalItems / pageSize)

    if (page > totalPages) {
      page = totalPages
    }

    const people = await GET_DB()
      .collection(PEOPLE_COLLECTION_NAME)
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray()

    return { people, page, totalPages }
  } catch (error) {
    throw new Error(error)
  }
}

const search = async (keyword, page, pageSize) => {
  try {
    const totalItems = await GET_DB()
      .collection(PEOPLE_COLLECTION_NAME)
      .countDocuments({ name: { $regex: keyword, $options: 'i' } })

    if (totalItems === 0) {
      return { people: [], page: 1, totalPages: 1 }
    }
    const totalPages = Math.ceil(totalItems / pageSize)

    if (page > totalPages) {
      page = totalPages
    }

    const people = await GET_DB()
      .collection(PEOPLE_COLLECTION_NAME)
      .find({ name: { $regex: keyword, $options: 'i' } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray()

    return { people, page, totalPages }
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (data) => {
  try {
    const updateData = { ...data }
    for (let field of INVALID_UPDATE_FIELDS) {
      delete updateData[field]
    }
    const validatedData = await PEOPLE_COLLECTION_SCHEMA.validateAsync(
      updateData
    )
    const createdPeople = await GET_DB()
      .collection(PEOPLE_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(String(data._id)) },
        { $set: validatedData },
        { returnDocument: 'after' }
      )
    return createdPeople
  } catch (error) {
    throw new Error(error)
  }
}
const create = async (data) => {
  try {
    const validatedData = await PEOPLE_COLLECTION_SCHEMA.validateAsync(data)
    const createdPeople = await GET_DB()
      .collection(PEOPLE_COLLECTION_NAME)
      .insertOne(validatedData)
    return createdPeople
  } catch (error) {
    throw new Error(error)
  }
}

export const peopleModel = { getById, getAll, search, update, create }
