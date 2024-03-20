import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import TabNavigator from './TabNavigator'
import EditProfileScreen from '../screens/profileScreen/EditProfileScreen'

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
    </Stack.Navigator>
  )
}

export default MainNavigator
