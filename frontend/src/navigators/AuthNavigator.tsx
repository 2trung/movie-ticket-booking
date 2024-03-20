import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import {
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  VerificationScreen,
  ResetPasswordScreen,
} from '../screens/index'
import OnbroadingScreen from '../screens/authScreen/OnbroadingScreen'

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='OnbroadingScreen' component={OnbroadingScreen} />
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
