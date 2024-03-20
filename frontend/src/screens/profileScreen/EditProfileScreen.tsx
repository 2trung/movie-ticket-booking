import ContainerComponent from '../../components/ContainerComponent'
import {
  Text,
  ScrollView,
  Image,
  View,
  StyleSheet,
  StatusBar,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/authReducer'
import { AntDesign } from '@expo/vector-icons'
import { useState } from 'react'

const EditProfileScreen = ({ navigation }) => {
  const auth = useSelector(authSelector)
  const [image, setImage] = useState(null)
  const handleUpload = async () => {
    if (Platform.OS !== 'web') {
      const status = ImagePicker.requestMediaLibraryPermissionsAsync()
      // console.log(status)
    }
    try {
      const file = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        base64: true,
      })
      console.log(file.assets[0].base64)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <View style={{ flex: 1, flexGrow: 1, backgroundColor: '#000' }}>
      <View
        style={{
          height: '20%',
          backgroundColor: '#fcc434',
          zIndex: 1,
          marginBottom: 20,
        }}
      >
        <SafeAreaView>
          <TouchableOpacity
            style={{
              position: 'absolute',
              left: '5%',
              paddingTop:
                Platform.OS === 'android' ? StatusBar.currentHeight : 45,
            }}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name='arrowleft' size={24} color='#000' />
          </TouchableOpacity>

          <Text style={styles.textLarge}>Chỉnh sửa thông tin</Text>
        </SafeAreaView>
        <Image
          source={{ uri: `data:image/jpeg;base64,${auth.avatar}` }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 999,
            alignSelf: 'center',
            position: 'absolute',
            top: '70%',
            borderColor: '#fff',
            borderWidth: 2,
          }}
        />
        <Button
          icon='upload'
          mode='contained'
          buttonColor='#FCC434'
          textColor='#000'
          style={{
            width: '40%',
            alignSelf: 'center',
            top: '140%',
            position: 'absolute',
          }}
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
              style={{
                backgroundColor: '#000',
                width: '90%',
                marginBottom: 20,
              }}
              underlineColor='#fff'
              activeUnderlineColor='#fff'
              textColor='#fff'
              //   value={}
              //   onChangeText={text => setText(text)}
            />
            <TextInput
              label='Email'
              style={{
                backgroundColor: '#000',
                width: '90%',
                marginBottom: 20,
              }}
              underlineColor='#fff'
              activeUnderlineColor='#fff'
              textColor='#fff'
              //   value={email}
              defaultValue={auth.email}
              //   onChangeText={text => setText(text)}
            />
            <TextInput
              label='Số điện thoại'
              style={{
                backgroundColor: '#000',
                width: '90%',
                marginBottom: 20,
              }}
              underlineColor='#fff'
              activeUnderlineColor='#fff'
              textColor='#fff'
              //   value={text}
              //   onChangeText={text => setText(text)}
            />
          </View>
        </View>
      </ContainerComponent>
      <Button
        mode='contained'
        buttonColor='#FCC434'
        textColor='#000'
        labelStyle={styles.textButton}
        style={styles.button}
        onPress={() => console.log('Pressed')}
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
    // position: 'absolute',
    bottom: 0,
  },
  textLarge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 50,
    alignSelf: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
})
export default EditProfileScreen
