import { View, StyleSheet } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import { useState } from 'react'
import Toast from 'react-native-toast-message'

import { isValidateEmail } from '../../utils/emailValidate'
import { registerAPI } from '../../apis'

import CustomHeader from '../../components/CustomHeader'
import ContainerComponent from '../../components/ContainerComponent'

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = () => setShowPassword(!showPassword)

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword)

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      return Toast.show({
        type: 'error',
        text1: 'Vui lòng điền đầy đủ thông tin',
      })
    }

    if (!isValidateEmail(email)) {
      return Toast.show({
        type: 'error',
        text1: 'Email không hợp lệ',
      })
    }

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
    await registerAPI(email, password, confirmPassword)
      .then((res) => {
        Toast.show({
          type: 'success',
          text1: res.message,
        })
        navigation.navigate('LoginScreen')
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
          style={styles.backButton}
          textColor='#fff'
          onPress={() => navigation.goBack()}
        >
          Quay lại
        </Button>
        <CustomHeader
          text='Đăng ký'
          variant='title'
          style={{ marginBottom: 50 }}
        />
        <TextInput
          placeholder='Email'
          style={styles.input}
          underlineColor='#fff'
          activeUnderlineColor='#fff'
          textColor='#fff'
          textContentType='emailAddress'
          left={<TextInput.Icon icon='email-outline' color={'#fff'} />}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          placeholder='Mật khẩu'
          style={styles.input}
          underlineColor='#fff'
          activeUnderlineColor='#fff'
          textColor='#fff'
          secureTextEntry={showPassword ? false : true}
          onChangeText={(password) => setPassword(password)}
          left={<TextInput.Icon icon='form-textbox-password' color={'#fff'} />}
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
          placeholder='Xác nhận mật khẩu'
          style={styles.input}
          underlineColor='#fff'
          activeUnderlineColor='#fff'
          textColor='#fff'
          secureTextEntry={showConfirmPassword ? false : true}
          onChangeText={(confirmPassword) =>
            setConfirmPassword(confirmPassword)
          }
          left={<TextInput.Icon icon='form-textbox-password' color={'#fff'} />}
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
          onPress={() => handleRegister()}
        >
          Đăng ký
        </Button>
        <Button
          mode='outlined'
          // buttonColor='#FCC434'
          textColor='#fff'
          labelStyle={styles.textButton}
          style={styles.button}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          Đăng nhập
        </Button>
      </View>
    </ContainerComponent>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '30%',
  },
  textButton: {
    fontSize: 16,
    lineHeight: 30,
    fontWeight: 'bold',
  },
  button: {
    width: '90%',
    borderRadius: 10,
    margin: 10,
  },
  backButton: {
    position: 'absolute',
    left: '5%',
    top: 0,
  },
  input: {
    backgroundColor: '#000',
    width: '90%',
    marginBottom: 20,
  },
})

export default RegisterScreen
