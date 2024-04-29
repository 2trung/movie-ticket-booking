import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { useState } from 'react'

import ContainerComponent from '../../components/ContainerComponent'
import CustomHeader from '../../components/CustomHeader'

import { useDispatch } from 'react-redux'
import { forgetPassword } from '../../redux/reducers/authReducer'

import { isValidateEmail } from '../../utils/emailValidate'

import { AntDesign } from '@expo/vector-icons'

const ForgetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()

  const handleForgetPassword = async () => {
    if (!isValidateEmail(email)) {
      return Toast.show({
        type: 'error',
        text1: 'Email không hợp lệ',
      })
    }
    const result = await dispatch(forgetPassword({ email }) as any)
    if (forgetPassword.fulfilled.match(result)) {
      navigation.navigate('VerificationScreen')
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

export default ForgetPasswordScreen

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
