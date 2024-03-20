import AsyncStorage from '@react-native-async-storage/async-storage'
import { Text, Button, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { removeUser, userSelector } from '../../redux/reducers/userReducer'

const HomeScreen = () => {
  const dispatch = useDispatch()

  const user = useSelector(userSelector)

  const handleLogout = async () => {
    await AsyncStorage.clear()
    dispatch(removeUser({}))
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}
    >
      <Text style={{ color: '#fff' }}>Trang chủ</Text>
    </View>
  )
}

export default HomeScreen
