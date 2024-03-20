import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, SafeAreaView, AppRegistry } from 'react-native'
import Carousel from './components/Carousel'

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Carousel />
      <StatusBar style='auto' />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: 50,
  },
})
AppRegistry.registerComponent('App', () => App)
