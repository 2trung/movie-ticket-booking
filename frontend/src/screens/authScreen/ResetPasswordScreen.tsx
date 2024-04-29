import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import { useState } from 'react'
import Toast from 'react-native-toast-message'

import CustomHeader from '../../components/CustomHeader'
import ContainerComponent from '../../components/ContainerComponent'

import { AntDesign } from '@expo/vector-icons'

import { emailSelector, resetPassword } from '../../redux/reducers/authReducer'
import { useSelector, useDispatch } from 'react-redux'

const ResetPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = () => setShowPassword(!showPassword)

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword)

  const email = useSelector(emailSelector)
  const dispatch = useDispatch()

  const handleChangePassword = async () => {
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
    const result = await dispatch(
      resetPassword({
        email: email,
        newPassword: password,
        confirmation: confirmPassword,
      }) as any
    )
    if (resetPassword.fulfilled.match(result)) {
      navigation.navigate('LoginScreen')
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
          text='Đặt lại mật khẩu'
          variant='title'
          style={{ marginBottom: 50 }}
        />
        <TextInput
          placeholder='Đặt mật khẩu mới'
          style={styles.input}
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
          placeholder='Xác nhận mật khẩu mới'
          style={styles.input}
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
