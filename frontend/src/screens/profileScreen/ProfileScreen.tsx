import { useEffect } from 'react'
import { FC } from 'react'
import ContainerComponent from '../../components/ContainerComponent'
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/authReducer'
import { StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Fontisto } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import { Octicons } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { removeAuth } from '../../redux/reducers/authReducer'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch()

  const handleLogout = async () => {
    await AsyncStorage.clear()
    dispatch(removeAuth({}))
  }
  const selection = [
    {
      label: 'Vé của tôi',
      icon: <Fontisto name='ticket-alt' size={32} color='#fff' />,
      isLast: false,
      handle: () => {},
    },
    {
      label: 'Lịch sử đơn hàng',
      icon: <MaterialIcons name='shopping-cart' size={32} color='#fff' />,
      handle: () => {},
    },
    {
      label: 'Thay đổi giao diện',
      icon: (
        <MaterialCommunityIcons
          name='theme-light-dark'
          size={32}
          color='#fff'
        />
      ),
      isLast: false,
      handle: () => {},
    },
    {
      label: 'Đổi mật khẩu',
      icon: <MaterialIcons name='lock' size={32} color='#fff' />,
      isLast: false,
      handle: () => {},
    },
    {
      label: 'Đăng xuất',
      icon: <MaterialIcons name='logout' size={32} color='#fff' />,
      isLast: true,
      handle: handleLogout,
    },
  ]
  const auth = useSelector(authSelector)
  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen')
  }

  return (
    <ContainerComponent>
      <ScrollView>
        <TouchableOpacity onPress={handleEditProfile}>
          <FontAwesome
            name='pencil-square-o'
            size={24}
            color='#fff'
            style={{ position: 'absolute', right: 10, top: 10 }}
          />
        </TouchableOpacity>

        {/* User */}
        <View style={{ marginHorizontal: 20, marginVertical: 30 }}>
          <View style={styles.flexRow}>
            <Image
              source={{ uri: `data:image/jpeg;base64,${auth.avatar}` }}
              style={{ width: 100, height: 100, borderRadius: 999 }}
            />
            <View style={{ justifyContent: 'space-around' }}>
              <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700' }}>
                Trung Nguyen
              </Text>
              <View>
                <View
                  style={{
                    ...styles.flexRow,
                    columnGap: 10,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Feather name='phone' size={24} color='#fff' />
                  <Text style={{ color: '#fff' }}>0987654321</Text>
                </View>
                <View
                  style={{
                    ...styles.flexRow,
                    columnGap: 10,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Fontisto name='email' size={24} color='#fff' />
                  <Text style={{ color: '#fff' }}>{auth.email}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View>
          {selection.map((item, index) => (
            <UserSelection
              key={index}
              label={item.label}
              iconChildren={item.icon}
              isLast={item.isLast}
              handle={item.handle}
            />
          ))}
        </View>
      </ScrollView>
    </ContainerComponent>
  )
}

interface UserSelectionProps {
  label: string
  iconChildren: JSX.Element
  isLast: boolean
  handle: () => void
}

export const UserSelection: FC<UserSelectionProps> = ({
  label,
  iconChildren,
  isLast,
  handle,
}) => {
  return (
    <View style={{ alignSelf: 'center', width: '90%', height: 100 }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 30,
          borderBottomColor: '#4A4A4A',
          borderBottomWidth: isLast ? 0 : 0.5,
        }}
        onPress={handle}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {iconChildren}
          <Text style={{ color: '#fff', fontSize: 18 }}>{label}</Text>
        </View>
        <Octicons name='chevron-right' size={32} color='#fff' />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  flexRow: {
    flex: 1,
    flexGrow: 0,
    flexDirection: 'row',
    columnGap: 20,
    justifyContent: 'center',
  },
})
export default ProfileScreen
