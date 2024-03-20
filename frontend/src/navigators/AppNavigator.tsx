import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addUser, userSelector } from '../redux/reducers/userReducer'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import { SplashScreen } from '../screens'
import { getUserAPI } from '../apis'

const AppRouters = () => {
  const [isShowSplash, setIsShowSplash] = useState(true)

  const { setItem } = useAsyncStorage('auth')

  const user = useSelector(userSelector)
  const dispatch = useDispatch()

  const [accessToken, setAccessToken] = useState('')
  useEffect(() => {
    if (user.accessToken !== accessToken) {
      setAccessToken(user.accessToken)
    }
  }, [user])

  useEffect(() => {
    checkLogin()
    setAccessToken(user.accessToken)
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
      dispatch(addUser(user))
      await setItem(JSON.stringify(user.accessToken))
    } else {
      setIsShowSplash(false)
    }
  }

  return (
    <>
      {isShowSplash ? (
        <SplashScreen />
      ) : accessToken ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </>
  )
}

export default AppRouters
