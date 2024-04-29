import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'

const CINEMA_COLLECTION_NAME = 'cinemas'
const CINEMA_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().min(1).max(255).trim().required(),
  location: Joi.string().min(1).max(255).trim().required(),
})

const getById = async (_id) => {
  try {
    const cinema = await GET_DB()
      .collection(CINEMA_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(String(_id)) })
    return cinema
  } catch (error) {
    throw new Error(error)
  }
}

export const cinemaModel = { getById }
