import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addUser, userSelector } from '../redux/reducers/userReducer'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import { SplashScreen } from '../screens'
import { getUserAPI } from '../apis'

const AppRouters = () => {
  const [isShowSplash, setIsShowSplash] = useState(true)

  // const { setItem } = useAsyncStorage('auth')

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
    try {
      const response = await getUserAPI()
      dispatch(addUser(response))
      setIsShowSplash(false)
    } catch (error) {
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
