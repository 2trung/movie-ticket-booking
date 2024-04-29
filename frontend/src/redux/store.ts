import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './reducers/userReducer'
import { orderReducer } from './reducers/orderReducer'
import { authReducer } from './reducers/authReducer'
import { movieReducer } from './reducers/movieReducer'
import { ticketReducer } from './reducers/ticketReducer'
import { searchReducer } from './reducers/searchReducer'

import thunkMiddleware from './thunkMiddleware'

const store = configureStore({
  reducer: {
    authReducer,
    userReducer,
    orderReducer,
    movieReducer,
    ticketReducer,
    searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunkMiddleware),
})

export default store
