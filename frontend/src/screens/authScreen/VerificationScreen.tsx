import { useRef, useState, useEffect } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import Toast from 'react-native-toast-message'

import ContainerComponent from '../../components/ContainerComponent'
import CustomHeader from '../../components/CustomHeader'

import { AntDesign } from '@expo/vector-icons'

import {
  emailSelector,
  resendOtp,
  verifyOtp,
} from '../../redux/reducers/authReducer'
import { useDispatch, useSelector } from 'react-redux'

const VerificationScreen = ({ route, navigation }) => {
  const dispatch = useDispatch()
  const [countdown, setCountdown] = useState(60)
  const [codeValues, setCodeValues] = useState<string[]>([])
  const email = useSelector(emailSelector)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((time) => time - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const ref1 = useRef<any>()
  const ref2 = useRef<any>()
  const ref3 = useRef<any>()
  const ref4 = useRef<any>()

  const handleChangeCode = (val: string, index: number) => {
    const data = [...codeValues]
    data[index] = val
    setCodeValues(data)
  }
  const handleResendOtp = async () => {
    const result = await dispatch(resendOtp({ email }) as any)
    if (resendOtp.fulfilled.match(result)) {
      setCountdown(60)
    }
  }
  const handleVerifyOtp = async () => {
    if (codeValues.join('').length < 4) {
      return Toast.show({
        type: 'error',
        text1: 'Vui lòng nhập đủ mã OTP',
      })
    }
    const result = await dispatch(
      verifyOtp({ email: email, otp: codeValues.join('') }) as any
    )
    if (verifyOtp.fulfilled.match(result)) {
      navigation.navigate('ResetPasswordScreen')
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
        <CustomHeader text='Xác thực OTP' variant='title' />
        <CustomHeader text='Mã OTP đã được gửi đến email' variant='body2' />
        <CustomHeader
          text={email}
          variant='body2'
          style={{ marginBottom: 50 }}
        />
        <View style={styles.otpRow}>
          <TextInput
            ref={ref1}
            style={styles.input}
            underlineColor='#fff'
            activeUnderlineColor='#FCC434'
            textColor='#FCC434'
            maxLength={1}
            keyboardType='numeric'
            onChangeText={(val) => {
              val.length > 0 && ref2.current.focus()
              handleChangeCode(val, 0)
            }}
          />
          <TextInput
            ref={ref2}
            style={styles.input}
            underlineColor='#fff'
            activeUnderlineColor='#FCC434'
            textColor='#FCC434'
            maxLength={1}
            keyboardType='numeric'
            onChangeText={(val) => {
              val.length > 0 && ref3.current.focus()
              val.length == 0 && ref1.current.focus()
              handleChangeCode(val, 1)
            }}
          />
          <TextInput
            ref={ref3}
            style={styles.input}
            underlineColor='#fff'
            activeUnderlineColor='#FCC434'
            textColor='#FCC434'
            maxLength={1}
            keyboardType='numeric'
            onChangeText={(val) => {
              val.length > 0 && ref4.current.focus()
              val.length == 0 && ref2.current.focus()
              handleChangeCode(val, 2)
            }}
          />
          <TextInput
            ref={ref4}
            style={styles.input}
            underlineColor='#fff'
            activeUnderlineColor='#FCC434'
            textColor='#FCC434'
            maxLength={1}
            keyboardType='numeric'
            onChangeText={(val) => {
              val.length == 0 && ref3.current.focus()
              handleChangeCode(val, 3)
            }}
          />
        </View>
        <Button
          mode='contained'
          buttonColor='#FCC434'
          textColor='#000'
          labelStyle={styles.textButton}
          style={styles.button}
          // loading={loading}
          onPress={() => handleVerifyOtp()}
        >
          Gửi
        </Button>

        {countdown > 0 ? (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ color: '#fff' }}>
              Gửi lại OTP sau {countdown} giây{' '}
            </Text>
          </View>
        ) : (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ color: '#fff' }}>Không nhận được OTP? </Text>
            <TouchableOpacity onPress={() => handleResendOtp()}>
              <Text style={{ color: '#23b2ff' }}>Gửi lại</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ContainerComponent>
  )
}

export default VerificationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '30%',
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
    marginTop: 50,
    marginBottom: 20,
    width: '90%',
  },
  input: {
    height: 55,
    width: 55,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#000',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: '5%',
    top: 0,
  },
})
