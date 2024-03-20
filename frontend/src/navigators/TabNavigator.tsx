import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform } from 'react-native'
//HomeNavigator
import { HomeScreen } from '../screens'
import ProfileNavigator from './ProfileNavigator'

import { Feather } from '@expo/vector-icons'

const TabNavigator = () => {
  const Tab = createBottomTabNavigator()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 68,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
          alignSelf: 'center',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let icon: JSX.Element
          size = 24
          switch (route.name) {
            case 'Home':
              icon = (
                <Feather
                  name='home'
                  size={24}
                  color={focused ? '#FCC434' : '#fff'}
                />
              )
              break

            case 'ProfileNavigator':
              icon = (
                <Feather
                  name='user'
                  size={24}
                  color={focused ? '#FCC434' : '#fff'}
                />
              )
              break
          }
          return icon
        },
        tabBarActiveTintColor: '#FCC434',
        tabBarInactiveTintColor: '#fff',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          flex: 1,
        },
        tabBarItemStyle: {
          marginTop: 10,
        },
      })}
    >
      <Tab.Screen
        name='Home'
        options={{ tabBarLabel: 'Trang chủ' }}
        component={HomeScreen}
      />
      <Tab.Screen
        name='ProfileNavigator'
        options={{ tabBarLabel: 'Hồ sơ' }}
        component={ProfileNavigator}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator
