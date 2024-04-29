import AppRouters from './src/navigators/AppNavigator'
import Toast from 'react-native-toast-message'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style='light' />
        <AppRouters />
      </NavigationContainer>
      <Toast />
    </Provider>
  )
}
