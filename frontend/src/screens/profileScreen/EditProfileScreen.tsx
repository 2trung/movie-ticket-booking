import {
  Text,
  Image,
  View,
  StyleSheet,
  StatusBar,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { TextInput, Button } from 'react-native-paper'

import * as ImagePicker from 'expo-image-picker'
import { AntDesign } from '@expo/vector-icons'

import { useDispatch, useSelector } from 'react-redux'
import { userSelector } from '../../redux/reducers/userReducer'
import { useState } from 'react'

import ContainerComponent from '../../components/ContainerComponent'
import Toast from 'react-native-toast-message'

import { updateUser } from '../../redux/reducers/userReducer'

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const user = useSelector(userSelector)

  const [avatar, setAvatar] = useState(user.avatar)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone)
  const [fileAvatar, setFileAvatar] = useState<any>()

  const handleUpload = async () => {
    try {
      const file = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        base64: true,
        quality: 1,
      })
      setAvatar(file.assets[0].base64)
      setFileAvatar(file.assets[0])
    } catch (error) {
      return Toast.show({
        type: 'error',
        text1: 'Không tìm thấy hình ảnh',
      })
    }
  }
  const handleSave = async () => {
    await dispatch(
      updateUser({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        avatar: fileAvatar
          ? {
              uri: fileAvatar.uri,
              name: fileAvatar.fileName,
              type: fileAvatar.mimeType,
            }
          : '',
      }) as any
    )
  }

  return (
    <View style={{ flex: 1, flexGrow: 1, backgroundColor: '#000' }}>
      <View style={styles.userAvatarContainer}>
        <SafeAreaView>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name='arrowleft' size={36} color='#000' />
          </TouchableOpacity>

          <Text style={styles.textLarge}>Chỉnh sửa thông tin</Text>
        </SafeAreaView>
        <Image
          source={{ uri: `data:image/jpeg;base64,${avatar}` }}
          style={styles.avatar}
        />
        <Button
          icon='upload'
          mode='contained'
          buttonColor='#FCC434'
          textColor='#000'
          style={styles.uploadBtn}
          onPress={() => handleUpload()}
        >
          Tải lên
        </Button>
      </View>

      <ContainerComponent>
        <View
          style={{
            flexGrow: 1,
            justifyContent: 'center',
            width: '100%',
            backgroundColor: '#000',
          }}
        >
          <View style={styles.container}>
            <TextInput
              label='Tên hiển thị'
              style={styles.input}
              underlineColor='#fff'
              activeUnderlineColor='#fff'
              textColor='#fff'
              value={name}
              defaultValue={name}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              label='Email'
              style={styles.input}
              underlineColor='#fff'
              activeUnderlineColor='#fff'
              textColor='#fff'
              value={email}
              defaultValue={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              label='Số điện thoại'
              style={styles.input}
              underlineColor='#fff'
              activeUnderlineColor='#fff'
              textColor='#fff'
              value={phone}
              onChangeText={(text) => setPhone(text)}
            />
          </View>
        </View>
      </ContainerComponent>
      <Button
        mode='contained'
        buttonColor='#FCC434'
        textColor='#000'
        labelStyle={styles.buttonLabel}
        style={styles.saveButton}
        onPress={() => handleSave()}
        // loading={loading}
        // disabled={loading}
      >
        Lưu
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '35%',
  },
  buttonLabel: {
    fontSize: 16,
    lineHeight: 30,
    fontWeight: 'bold',
  },
  saveButton: {
    width: '90%',
    borderRadius: 10,
    margin: 10,
    bottom: 0,
    alignSelf: 'center',
  },
  textLarge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 50,
    alignSelf: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  userAvatarContainer: {
    height: '20%',
    backgroundColor: '#fcc434',
    zIndex: 1,
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: '5%',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 45,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 999,
    alignSelf: 'center',
    position: 'absolute',
    top: '55%',
    borderColor: '#fff',
    borderWidth: 2,
  },
  input: {
    backgroundColor: '#000',
    width: '90%',
    marginBottom: 20,
  },
  uploadBtn: {
    width: '40%',
    alignSelf: 'center',
    top: '88%',
  },
})
export default EditProfileScreen
