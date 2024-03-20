import AsyncStorage from '@react-native-async-storage/async-storage'
import { Text, Button, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { removeAuth, authSelector } from '../../redux/reducers/authReducer'

const HomeScreen = () => {
  const dispatch = useDispatch()

  const auth = useSelector(authSelector)

  const handleLogout = async () => {
    await AsyncStorage.clear()
    dispatch(removeAuth({}))
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title='Đăng xuất' onPress={handleLogout} />
    </View>
  )
}

export default HomeScreen
