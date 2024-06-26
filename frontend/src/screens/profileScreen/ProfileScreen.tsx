import { FC } from 'react'
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import { userSelector } from '../../redux/reducers/userReducer'
import { useSelector } from 'react-redux'
import { logout } from '../../redux/reducers/authReducer'
import { useDispatch } from 'react-redux'

import ContainerComponent from '../../components/ContainerComponent'

import {
  FontAwesome,
  Fontisto,
  Feather,
  Octicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch()

  const handleLogout = async () => {
    dispatch(logout({}))
  }
  const selection = [
    {
      label: 'Vé của tôi',
      icon: <Fontisto name='ticket-alt' size={32} color='#fff' />,
      isLast: false,
      handle: () => {
        navigation.navigate('TicketsScreen')
      },
    },
    {
      label: 'Lịch sử đơn hàng',
      icon: <MaterialIcons name='shopping-cart' size={32} color='#fff' />,
      handle: () => {
        navigation.navigate('OrderHistoryScreen')
      },
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
      handle: () => {
        navigation.navigate('ChangePasswordScreen')
      },
    },
    {
      label: 'Đăng xuất',
      icon: <MaterialIcons name='logout' size={32} color='#fff' />,
      isLast: true,
      handle: handleLogout,
    },
  ]
  const user = useSelector(userSelector)
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
            style={styles.editBtn}
          />
        </TouchableOpacity>

        {/* Thông tin user container */}
        <View style={styles.flexRow}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${user?.avatar}` }}
            style={styles.avatar}
          />
          <View style={{ justifyContent: 'space-around' }}>
            <Text style={styles.userName}>
              {user?.name ? user?.name : 'User'}
            </Text>
            <View>
              <View style={styles.flexRowStart}>
                <Feather name='phone' size={24} color='#fff' />
                <Text style={{ color: '#fff' }}>
                  {user?.phone === '' ? '+84xxxxxxxxx' : user?.phone}
                </Text>
              </View>
              <View style={styles.flexRowStart}>
                <Fontisto name='email' size={24} color='#fff' />
                <Text style={{ color: '#fff' }}>{user?.email}</Text>
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
    marginHorizontal: 20,
    marginVertical: 30,
  },
  flexRowStart: {
    flex: 1,
    flexGrow: 0,
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  editBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 999,
    borderColor: '#fff',
    borderWidth: 2,
  },
  userName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
})
export default ProfileScreen
