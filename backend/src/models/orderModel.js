import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'

const ORDER_COLLECTION_NAME = 'orders'
const ORDER_COLLECTION_SCHEMA = Joi.object({
  user_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  schedule_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  seats: Joi.array().items(Joi.string()).required(),
  order_time: Joi.date().timestamp('javascript').required(),
  status: Joi.string().required(),
  paymentMethod: Joi.string().default(null),
  total: Joi.number().required(),
})

const validateBeforeCreate = async (data) => {
  return await ORDER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  })
}

const createOrder = async (order) => {
  try {
    const validatedOrder = await validateBeforeCreate(order)
    const newOrder = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .insertOne(validatedOrder)
    return newOrder
  } catch (error) {
    throw new Error(error)
  }
}
const getById = async (orderId) => {
  try {
    const order = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(String(orderId)) })
    return order
  } catch (error) {
    throw new Error(error)
  }
}

const updateOrder = async (orderId, order) => {
  try {
    const updatedOrder = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(String(orderId)) },
        { $set: order },
        { returnDocument: 'after' }
      )

    return updatedOrder
  } catch (error) {
    throw new Error(error)
  }
}
const getByUserId = async (userId) => {
  try {
    const orders = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .find({ user_id: userId })
      .toArray()
    return orders
  } catch (error) {
    throw new Error(error)
  }
}

export const orderModel = {
  createOrder,
  updateOrder,
  getById,
  getByUserId,
}
