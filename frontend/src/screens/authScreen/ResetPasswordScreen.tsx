import ContainerComponent from '../../components/ContainerComponent'
import { Text, View, StyleSheet } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'
import Toast from 'react-native-toast-message'
import { resetPasswordAPI } from '../../apis'

const ResetPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = () => setShowPassword(!showPassword)

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword)

  const handleChangePassword = async () => {
    const auth = await AsyncStorage.getItem('auth')
    const authData = JSON.parse(auth || '{}')

    if (password !== confirmPassword) {
      return Toast.show({
        type: 'error',
        text1: 'Mật khẩu không khớp',
      })
    }
    if (password.length < 6) {
      return Toast.show({
        type: 'error',
        text1: 'Mật khẩu phải có ít nhất 6 ký tự',
      })
    }

    await resetPasswordAPI(authData.email, password, confirmPassword)
      .then((res) => {
        Toast.show({
          type: 'success',
          text1: res.message,
        })
        AsyncStorage.clear()
        setTimeout(() => {
          navigation.navigate('LoginScreen')
        }, 2000)
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: err.response.data.message,
        })
      })
  }
  return (
    <ContainerComponent>
      <View style={styles.container}>
        <Button
          icon='arrow-left'
          style={{
            position: 'absolute',
            left: '5%',
            top: 0,
          }}
          textColor='#fff'
          onPress={() => navigation.goBack()}
        >
          Quay lại
        </Button>
        <Text style={styles.textLarge}>Đặt lại mật khẩu</Text>
        <TextInput
          placeholder='New Password'
          style={{ backgroundColor: '#000', width: '90%', marginBottom: 20 }}
          underlineColor='#fff'
          activeUnderlineColor='#fff'
          textColor='#fff'
          secureTextEntry={showPassword ? false : true}
          onChangeText={(password) => setPassword(password)}
          right={
            showPassword ? (
              <TextInput.Icon
                icon='eye'
                color={'#fff'}
                onPress={toggleShowPassword}
              />
            ) : (
              <TextInput.Icon
                icon='eye-off'
                color={'#fff'}
                onPress={toggleShowPassword}
              />
            )
          }
        />
        <TextInput
          placeholder='Confirm Password'
          style={{ backgroundColor: '#000', width: '90%', marginBottom: 20 }}
          underlineColor='#fff'
          activeUnderlineColor='#fff'
          textColor='#fff'
          secureTextEntry={showConfirmPassword ? false : true}
          onChangeText={(confirmPassword) =>
            setConfirmPassword(confirmPassword)
          }
          right={
            showConfirmPassword ? (
              <TextInput.Icon
                icon='eye'
                color={'#fff'}
                onPress={toggleShowConfirmPassword}
              />
            ) : (
              <TextInput.Icon
                icon='eye-off'
                color={'#fff'}
                onPress={toggleShowConfirmPassword}
              />
            )
          }
        />
        <Button
          mode='contained'
          buttonColor='#FCC434'
          textColor='#000'
          labelStyle={styles.textButton}
          style={styles.button}
          onPress={() => handleChangePassword()}
        >
          Xác nhận
        </Button>
      </View>
    </ContainerComponent>
  )
}

export default ResetPasswordScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '30%',
  },
  textLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 50,
  },
  text: {
    color: '#fff',
  },
  textButton: {
    fontSize: 16,
    lineHeight: 30,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 10,
    margin: 50,
    width: '90%',
  },
  input: {
    height: 55,
    width: 55,
    borderRadius: 12,
    borderWidth: 1,
    // borderColor: appColors.gray2,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    // fontFamily: fontFamilies.bold,
    textAlign: 'center',
    backgroundColor: '#000',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
})
