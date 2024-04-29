import React from 'react'
import { Text, View } from 'react-native'
import LottieView from 'lottie-react-native'
import { getUser } from '../redux/reducers/userReducer'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

const SplashScreen = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getUser() as any)
  }, [])
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}
    >
      <LottieView
        source={require('../assets/Animation.json')}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
    </View>
  )
}

export default SplashScreen
