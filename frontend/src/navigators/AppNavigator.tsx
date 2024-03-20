import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAuth, authSelector } from '../redux/reducers/authReducer'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import { SplashScreen } from '../screens'
import { getUserAPI } from '../apis'

const AppRouters = () => {
  const [isShowSplash, setIsShowSplash] = useState(true)

  const { setItem } = useAsyncStorage('auth')

  const auth = useSelector(authSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    checkLogin()
    const timeout = setTimeout(() => {
      setIsShowSplash(false)
    }, 1500)
    return () => clearTimeout(timeout)
  }, [])

  const checkLogin = async () => {
    const auth = await AsyncStorage.getItem('auth')
    const authData = JSON.parse(auth || '{}')
    if (authData.accessToken) {
      const user = await getUserAPI(authData.accessToken)
      dispatch(addAuth(user))
      await setItem(JSON.stringify(user))
    } else {
      setIsShowSplash(false)
    }
  }

  return (
    <>
      {isShowSplash ? (
        <SplashScreen />
      ) : auth.accessToken ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </>
  )
}

export default AppRouters
