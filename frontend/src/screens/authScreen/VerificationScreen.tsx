import { useRef, useState, useEffect } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import Toast from 'react-native-toast-message'

import AsyncStorage from '@react-native-async-storage/async-storage'

import ContainerComponent from '../../components/ContainerComponent'
import CustomHeader from '../../components/CustomHeader'
import { verifyOtpAPI, resendOtpAPI } from '../../apis'

const VerificationScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [countdown, setCountdown] = useState(60)
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((time) => time - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getEmail = async () => {
      const user = await AsyncStorage.getItem('auth')
      const userData = JSON.parse(user || '{}')
      setEmail(userData.email)
    }
    getEmail()
  }, [])

  const ref1 = useRef<any>()
  const ref2 = useRef<any>()
  const ref3 = useRef<any>()
  const ref4 = useRef<any>()

  const [codeValues, setCodeValues] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   ref1.current.focus()
  // }, [])

  const handleChangeCode = (val: string, index: number) => {
    const data = [...codeValues]
    data[index] = val
    setCodeValues(data)
  }
  const handleResendOtp = async () => {
    const auth = await AsyncStorage.getItem('auth')
    const authData = JSON.parse(auth || '{}')
    await resendOtpAPI(authData.email)
      .then((res) => {
        Toast.show({
          type: 'success',
          text1: res.message,
        })
        setCountdown(60)
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: err.response.data.message,
        })
      })
  }
  const handleVerifyOtp = async () => {
    setLoading(true)
    if (codeValues.join('').length < 4) {
      setLoading(false)
      return Toast.show({
        type: 'error',
        text1: 'Vui lòng nhập đủ mã OTP',
      })
    }
    const auth = await AsyncStorage.getItem('auth')
    const authData = JSON.parse(auth || '{}')
    await verifyOtpAPI(authData.email, codeValues.join(''))
      .then((res) => {
        setLoading(false)
        Toast.show({
          type: 'success',
          text1: res.message,
        })
        AsyncStorage.setItem('auth', JSON.stringify(res.data))
        navigation.navigate('ResetPasswordScreen')
      })
      .catch((err) => {
        setLoading(false)
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
          loading={loading}
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
