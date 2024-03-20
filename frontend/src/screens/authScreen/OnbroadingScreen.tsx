import { StatusBar } from 'expo-status-bar'
import { Button } from 'react-native-paper'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'

import Carousel from '../../components/carousel/carousel'
import AppStyle from '../../theme'

const OnbroadingScreen = ({ navigation }) => {
  const footerLink = [
    'Điều khoản sử dụng',
    'Chính sách bảo mật',
    'Hỗ trợ',
    'Liên hệ',
  ]
  return (
    <SafeAreaView style={AppStyle.StyleMain.container}>
      <StatusBar style='light' />
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
      <Text style={AppStyle.StyleMain.text}>Đăng Ký Thành Viên</Text>
      <Text style={AppStyle.StyleMain.text}>Nhận Ngay Ưu Đãi</Text>

      <View style={{ position: 'absolute', bottom: 50, width: '100%' }}>
        <Button
          mode='contained'
          buttonColor='#FCC434'
          textColor='#000'
          labelStyle={AppStyle.StyleMain.textButton}
          style={AppStyle.StyleMain.button}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          Đăng nhập
        </Button>

        <Button
          mode='outlined'
          textColor='#fff'
          labelStyle={AppStyle.StyleMain.textButton}
          style={AppStyle.StyleMain.button}
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
              <Text style={AppStyle.StyleMain.textsmall}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default OnbroadingScreen
