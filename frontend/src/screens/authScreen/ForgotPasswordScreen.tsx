import { View, StyleSheet } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { useState } from 'react'

import ContainerComponent from '../../components/ContainerComponent'
import CustomHeader from '../../components/CustomHeader'

import { useDispatch } from 'react-redux'
import { addUser } from '../../redux/reducers/userReducer'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { isValidateEmail } from '../../utils/emailValidate'
import { forgetPasswordAPI } from '../../apis'

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()

  const handleForgetPassword = async () => {
    if (!isValidateEmail(email)) {
      return Toast.show({
        type: 'error',
        text1: 'Email không hợp lệ',
      })
    }

    await forgetPasswordAPI(email)
      .then((res) => {
        dispatch(addUser(res.data))
        AsyncStorage.setItem('auth', JSON.stringify(res.data))
        navigation.navigate('VerificationScreen')
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
        <CustomHeader text='Đặt lại mật khẩu' variant='title' />
        <CustomHeader
          text='Hãy nhập địa chỉ Email của bạn'
          variant='body2'
          style={{ marginBottom: 50 }}
        />

        <TextInput
          placeholder='Email'
          style={{ backgroundColor: '#000', width: '90%', marginBottom: 20 }}
          underlineColor='#fff'
          activeUnderlineColor='#fff'
          textColor='#fff'
          textContentType='emailAddress'
          left={<TextInput.Icon icon='email-outline' color={'#fff'} />}
          onChangeText={(email) => setEmail(email)}
        />
        <Button
          mode='contained'
          buttonColor='#FCC434'
          textColor='#000'
          labelStyle={styles.textButton}
          style={styles.button}
          onPress={() => handleForgetPassword()}
        >
          Gửi
        </Button>
      </View>
    </ContainerComponent>
  )
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '30%',
  },
  text: {
    color: '#fff',
    marginBottom: 50,
  },
  textButton: {
    fontSize: 16,
    lineHeight: 30,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 10,
    margin: 10,
    width: '90%',
  },
  backButton: { position: 'absolute', left: '5%', top: 0 },
})
