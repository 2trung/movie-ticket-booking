import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { authSelector } from '../redux/reducers/authReducer'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import { SplashScreen } from '../screens'

const AppRouters = () => {
  const [isShowSplash, setIsShowSplash] = useState(true)

  const auth = useSelector(authSelector)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowSplash(false)
    }, 1500)
    return () => clearTimeout(timeout)
  }, [auth])

  return (
    <>
      {isShowSplash ? (
        <SplashScreen />
      ) : auth?.isLogin ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </>
  )
}

export default AppRouters
