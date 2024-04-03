import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const PEOPLE_COLLECTION_NAME = 'people'
const PEOPLE_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().min(1).max(255).trim().required(),
  photo: Joi.string().min(1).max(255).trim().required(),
})

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

export const peopleModel = { getById }
