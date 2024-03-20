import React from 'react'
import { Text, View } from 'react-native'
import LottieView from 'lottie-react-native'

const SplashScreen = () => {
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
