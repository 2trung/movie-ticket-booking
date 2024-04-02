import { TextInput, Button } from 'react-native-paper'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useState } from 'react'

import Toast from 'react-native-toast-message'

import ContainerComponent from '../../components/ContainerComponent'
import CustomHeader from '../../components/CustomHeader'

import { changePasswordAPI } from '../../apis/userApi'
import { AntDesign } from '@expo/vector-icons'

const ChanegPasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [showOldPassword, setShowOldPassword] = useState(false)
  const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword)

  const [loading, setLoading] = useState(false)

  const handleChangePassword = async () => {
    setLoading(true)

    if (oldPassword === '' || newPassword === '' || confirmNewPassword === '') {
      setLoading(false)
      return Toast.show({
        type: 'error',
        text1: 'Vui lòng nhập đầy đủ thông tin',
      })
    }

    if (newPassword.length < 6) {
      setLoading(false)
      return Toast.show({
        type: 'error',
        text1: 'Mật khẩu phải có ít nhất 6 ký tự',
      })
    }

    if (newPassword !== confirmNewPassword) {
      setLoading(false)
      return Toast.show({
        type: 'error',
        text1: 'Mật khẩu không khớp',
      })
    }
    await changePasswordAPI(oldPassword, newPassword, confirmNewPassword)
      .then((res) => {
        setLoading(false)
        return Toast.show({
          type: 'success',
          text1: res.message,
        })
      })
      .catch((err) => {
        setLoading(false)
        return Toast.show({
          type: 'error',
          text1: err.response.data.message,
        })
      })
  }
  return (
    <ContainerComponent>
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: '5%',
          }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name='arrowleft' size={24} color='#fff' />
        </TouchableOpacity>
        <CustomHeader
          text='Đổi mật khẩu'
          variant='title'
          style={{ marginBottom: 50 }}
        />
        <TextInput
          placeholder='Mật khẩu hiện tại'
          style={styles.input}
          underlineColor='#fff'
          activeUnderlineColor='#fff'
          textColor='#fff'
          secureTextEntry={showOldPassword ? false : true}
          onChangeText={(password) => setOldPassword(password)}
          right={
            showOldPassword ? (
              <TextInput.Icon
                icon='eye'
                color={'#fff'}
                onPress={toggleShowOldPassword}
              />
            ) : (
              <TextInput.Icon
                icon='eye-off'
                color={'#fff'}
                onPress={toggleShowOldPassword}
              />
            )
          }
        />
        <TextInput
          placeholder='Mật khẩu mới'
          style={styles.input}
          underlineColor='#fff'
          activeUnderlineColor='#fff'
          textColor='#fff'
          secureTextEntry={showNewPassword ? false : true}
          onChangeText={(password) => setNewPassword(password)}
          right={
            showNewPassword ? (
              <TextInput.Icon
                icon='eye'
                color={'#fff'}
                onPress={toggleShowNewPassword}
              />
            ) : (
              <TextInput.Icon
                icon='eye-off'
                color={'#fff'}
                onPress={toggleShowNewPassword}
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
            setConfirmNewPassword(confirmPassword)
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
          loading={loading}
          onPress={handleChangePassword}
        >
          Xác nhận
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

export default ChanegPasswordScreen
