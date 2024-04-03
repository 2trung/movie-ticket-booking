import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

const FetchingApi = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}
    >
      <ActivityIndicator animating={true} color='#FCC434' size='large' />
    </View>
  )
}

export default FetchingApi
