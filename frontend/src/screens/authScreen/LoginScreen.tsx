import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { useState } from 'react'

import { isValidateEmail } from '../../utils/emailValidate'

import { useDispatch } from 'react-redux'
import { login } from '../../redux/reducers/authReducer'
import { authSelector } from '../../redux/reducers/authReducer'
import { getUser } from '../../redux/reducers/userReducer'
import { useSelector } from 'react-redux'

import ContainerComponent from '../../components/ContainerComponent'
import CustomHeader from '../../components/CustomHeader'

import { AntDesign } from '@expo/vector-icons'

const LoginScreen = ({ navigation }) => {
  const auth = useSelector(authSelector)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = () => setShowPassword(!showPassword)

  const dispatch = useDispatch()

  const handleLogin = async () => {
    try {
      if (email === '' || password === '') {
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
      await dispatch(login({ email, password }) as any)
      await dispatch(getUser() as any)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ContainerComponent>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name='arrowleft' size={36} color='#fff' />
        </TouchableOpacity>
        <CustomHeader
          text='Đăng nhập'
          variant='title'
          style={{
            marginBottom: 50,
          }}
        />
        <TextInput
          placeholder='Email'
          style={styles.input}
          underlineColor='#fff'
          activeUnderlineColor='#fff'
          textColor='#fff'
          textContentType='emailAddress'
          left={<TextInput.Icon icon='email-outline' color='#fff' />}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          placeholder='Mật khẩu'
          style={styles.input}
          underlineColor='#fff'
          activeUnderlineColor='#fff'
          textColor='#fff'
          secureTextEntry={showPassword ? false : true}
          left={<TextInput.Icon icon='form-textbox-password' color='#fff' />}
          onChangeText={(password) => setPassword(password)}
          right={
            showPassword ? (
              <TextInput.Icon
                icon='eye'
                color='#fff'
                onPress={toggleShowPassword}
              />
            ) : (
              <TextInput.Icon
                icon='eye-off'
                color='#fff'
                onPress={toggleShowPassword}
              />
            )
          }
        />
        <TouchableOpacity
          style={{ alignSelf: 'flex-end', paddingHorizontal: 20 }}
          onPress={() => navigation.navigate('ForgetPasswordScreen')}
        >
          <Text style={{ color: '#fff' }}>Quên mật khẩu?</Text>
        </TouchableOpacity>
        <Button
          mode='contained'
          buttonColor='#FCC434'
          textColor='#000'
          labelStyle={styles.textButton}
          style={styles.button}
          loading={auth.isLoading}
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
    backgroundColor: '#000',
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
