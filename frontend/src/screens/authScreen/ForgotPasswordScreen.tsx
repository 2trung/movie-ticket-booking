import { Text, View, StyleSheet } from 'react-native'
import ContainerComponent from '../../components/ContainerComponent'
import { TextInput, Button } from 'react-native-paper'
import { forgetPasswordAPI } from '../../apis'
import { useState } from 'react'
import Toast from 'react-native-toast-message'
import { isValidateEmail } from '../../utils/emailValidate'
import { useDispatch } from 'react-redux'
import { addAuth } from '../../redux/reducers/authReducer'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
        dispatch(addAuth(res.data))
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
        <Text style={styles.text}>Hãy nhập địa chỉ Email của bạn</Text>
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
  textLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
})
