import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { useState } from 'react'

import { loginAPI } from '../../apis'
import { isValidateEmail } from '../../utils/emailValidate'

import { useDispatch } from 'react-redux'
import { addUser } from '../../redux/reducers/userReducer'
import AsyncStorage from '@react-native-async-storage/async-storage'

import ContainerComponent from '../../components/ContainerComponent'
import CustomHeader from '../../components/CustomHeader'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = () => setShowPassword(!showPassword)

  const dispatch = useDispatch()

  const handleLogin = async () => {
    if (email === '' || password === '') {
      return Toast.show({
        type: 'error',
        text1: 'Vui lòng điền đầy đủ thông tin',
      })
    }

    if (!isValidateEmail(email))
      return Toast.show({
        type: 'error',
        text1: 'Email không hợp lệ',
      })

    await loginAPI(email, password)
      .then((res) => {
        Toast.show({
          type: 'success',
          text1: res.message,
        })
        dispatch(addUser(res.data))
        AsyncStorage.setItem('auth', JSON.stringify(res.data))
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
          text='Đăng nhập'
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
          left={<TextInput.Icon icon='form-textbox-password' color={'#fff'} />}
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
        <TouchableOpacity
          style={{ alignSelf: 'flex-end', paddingHorizontal: 20 }}
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
        >
          <Text style={{ color: '#fff' }}>Quên mật khẩu?</Text>
        </TouchableOpacity>
        <Button
          mode='contained'
          buttonColor='#FCC434'
          textColor='#000'
          labelStyle={styles.textButton}
          style={styles.button}
          onPress={() => handleLogin()}
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

export default LoginScreen
