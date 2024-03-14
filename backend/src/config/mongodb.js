import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

let movieDatabseInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()
  movieDatabseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

export const GET_DB = () => {
  if (!movieDatabseInstance) {
    throw new Error('Call CONNECT_DB first')
  }

  return movieDatabseInstance
}
