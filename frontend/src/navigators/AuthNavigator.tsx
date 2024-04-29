import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import {
  LoginScreen,
  RegisterScreen,
  ForgetPasswordScreen,
  VerificationScreen,
  ResetPasswordScreen,
} from '../screens/index'
import OnboardingScreen from '../screens/OnboardingScreen'

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
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
        name='ForgetPasswordScreen'
        component={ForgetPasswordScreen}
      />
    </Stack.Navigator>
  )
}

export default AuthNavigator
