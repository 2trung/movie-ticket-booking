import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import {
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  VerificationScreen,
  ResetPasswordScreen,
  SelectSeatScreen,
} from '../screens/index'
import OnboardingScreen from '../screens/OnboardingScreen'

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName='SelectSeatScreen'
    >
      <Stack.Screen name='OnboardingScreen' component={OnboardingScreen} />
      <Stack.Screen name='LoginScreen' component={LoginScreen} />
      <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
      <Stack.Screen name='VerificationScreen' component={VerificationScreen} />
      <Stack.Screen
        name='ResetPasswordScreen'
        component={ResetPasswordScreen}
      />
      <Stack.Screen
        name='ForgotPasswordScreen'
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  )
}

export default AuthNavigator
