import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'

const BOOKING_COLLECTION_NAME = 'bookings'
const BOOKING_COLLECTION_SCHEMA = Joi.object({
  user_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  schedule_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  seat_number: Joi.array().items(Joi.string()).required(),
  total: Joi.number().required(),
})
