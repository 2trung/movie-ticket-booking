import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform } from 'react-native'

import { HomeScreen, TicketsScreen, MovieScreen } from '../screens'
import ProfileNavigator from './ProfileNavigator'

import { Ionicons } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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
              icon = focused ? (
                <Ionicons name='home-sharp' size={24} color={'#FCC434'} />
              ) : (
                <Ionicons name='home-outline' size={24} color={'#fff'} />
              )
              break
            case 'TicketsScreen':
              icon = focused ? (
                <MaterialCommunityIcons
                  name='ticket-confirmation'
                  size={24}
                  color='#FCC434'
                />
              ) : (
                <MaterialCommunityIcons
                  name='ticket-confirmation-outline'
                  size={24}
                  color='#fff'
                />
              )
              break
            case 'MovieScreen':
              icon = focused ? (
                <Ionicons name='videocam' size={24} color='#FCC434' />
              ) : (
                <Ionicons name='videocam-outline' size={24} color='#fff' />
              )
              break

            case 'ProfileNavigator':
              icon = focused ? (
                <Ionicons name='person' size={24} color={'#FCC434'} />
              ) : (
                <Ionicons name='person-outline' size={24} color={'#fff'} />
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
        name='TicketsScreen'
        options={{ tabBarLabel: 'Vé của tôi' }}
        component={TicketsScreen}
      />
      <Tab.Screen
        name='MovieScreen'
        options={{ tabBarLabel: 'Phim' }}
        component={MovieScreen}
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
