import { Button } from 'react-native-paper'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native'

import Carousel from '../../components/Carousel'
import CustomHeader from '../../components/CustomHeader'

const OnbroadingScreen = ({ navigation }) => {
  const footerLink = [
    'Điều khoản sử dụng',
    'Chính sách bảo mật',
    'Hỗ trợ',
    'Liên hệ',
  ]
  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          color: '#FCC434',
          fontSize: 48,
          marginLeft: 50,
          marginBottom: 50,
        }}
      >
        Logo
      </Text>
      <Carousel />
      <Text
        style={{
          color: '#fff',
          fontSize: 24,
          marginTop: 16,
          marginBottom: 16,
          alignSelf: 'center',
        }}
      >
        Xin chào
      </Text>
      <Text style={styles.text}>Đăng Ký Thành Viên</Text>
      <Text style={styles.text}>Nhận Ngay Ưu Đãi</Text>

      <View style={{ position: 'absolute', bottom: 50, width: '100%' }}>
        <Button
          mode='contained'
          buttonColor='#FCC434'
          textColor='#000'
          labelStyle={styles.textButton}
          style={styles.button}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          Đăng nhập
        </Button>

        <Button
          mode='outlined'
          textColor='#fff'
          labelStyle={styles.textButton}
          style={styles.button}
          onPress={() => navigation.navigate('RegisterScreen')}
        >
          Đăng ký
        </Button>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          {footerLink.map((item, index) => (
            <TouchableOpacity key={index}>
              <Text style={styles.textsmall}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    alignSelf: 'center',
  },
  textsmall: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 10,
  },
  textButton: {
    fontSize: 16,
    lineHeight: 30,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 10,
    margin: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
})

export default OnbroadingScreen
