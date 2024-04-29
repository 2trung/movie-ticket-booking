import { Middleware } from 'redux'
import { logout } from './reducers/authReducer'
import Toast from 'react-native-toast-message'

const thunkMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if ((action as { type: string }).type.endsWith('/rejected')) {
      if ((action as any).payload.statusCode === 401) {
        console.log('Phiên đăng nhập hết hạn')
        Toast.show({
          type: 'error',
          text1: 'Phiên đăng nhập hết hạn',
        })
        setTimeout(() => {
          dispatch(logout({}))
        }, 0)
      }
    }
    return next(action)
  }

export default thunkMiddleware
