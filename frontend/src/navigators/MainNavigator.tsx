import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import TabNavigator from './TabNavigator'
import {
  EditProfileScreen,
  ChangePasswordScreen,
  TicketDetailScreen,
  PaymentScreen,
  MovieDetailScreen,
  SelectSeatScreen,
  SearchMovieScreen,
  SelectCinemaDateTime,
  OrderHistoryScreen,
} from '../screens'

const MainNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='TabNavigator' component={TabNavigator} />
      <Stack.Screen name='EditProfileScreen' component={EditProfileScreen} />
      <Stack.Screen
        name='ChangePasswordScreen'
        component={ChangePasswordScreen}
      />
      <Stack.Screen name='TicketDetailScreen' component={TicketDetailScreen} />
      <Stack.Screen name='PaymentScreen' component={PaymentScreen} />
      <Stack.Screen name='MovieDetailScreen' component={MovieDetailScreen} />
      <Stack.Screen name='SelectSeatScreen' component={SelectSeatScreen} />
      <Stack.Screen name='SearchMovieScreen' component={SearchMovieScreen} />
      <Stack.Screen
        name='SelectCinemaDateTime'
        component={SelectCinemaDateTime}
      />
      <Stack.Screen name='OrderHistoryScreen' component={OrderHistoryScreen} />
    </Stack.Navigator>
  )
}

export default MainNavigator
