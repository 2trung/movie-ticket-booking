import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import QRCode from 'react-native-qrcode-svg'

import ContainerComponent from '../../components/ContainerComponent'

import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import { Octicons } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'

const TicketDetailScreen = ({ navigation }) => {
  const WIDTH = Dimensions.get('window').width
  return (
    <ContainerComponent>
      <ScrollView>
        {/* <StatusBar style='light' /> */}
        {/* Header */}
        <View style={{ marginBottom: 40, alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name='arrowleft' size={36} color='#fff' />
          </TouchableOpacity>
          <Text style={{ color: '#f2f2f2', fontSize: 28, fontWeight: 'bold' }}>
            Vé của tôi
          </Text>
        </View>
        <View
          style={{ ...styles.container, width: WIDTH * 0.9, marginBottom: 20 }}
        >
          {/* Thông tin phim */}
          <View style={styles.header}>
            <View style={styles.movieCover} />
            <View style={{ width: WIDTH * 0.9 - 125 - 60, paddingTop: 20 }}>
              <Text numberOfLines={2} style={styles.movieTitle}>
                Avengers: Infinity War
              </Text>
              <View style={styles.movieDetailContainer}>
                <AntDesign
                  name='clockcircleo'
                  size={16}
                  color='black'
                  style={styles.alightCenter}
                />
                <Text numberOfLines={1} style={styles.alightCenter}>
                  2 giờ 29 phút
                </Text>
              </View>
              <View style={styles.movieDuration}>
                <Ionicons
                  name='videocam-outline'
                  size={20}
                  color='black'
                  style={styles.alightCenter}
                />
                <Text numberOfLines={1} style={styles.movieCens}>
                  Hành động, Phiêu lưu, Tâm lý
                </Text>
              </View>
            </View>
          </View>

          {/* Thông tin thời gian, số ghế */}
          <View style={styles.ticketDetail1}>
            <View style={styles.movieTime}>
              <AntDesign name='calendar' size={50} color='black' />
              <View style={{ justifyContent: 'space-around' }}>
                <Text style={{ fontWeight: '500' }}>19:00</Text>
                <Text style={{ fontWeight: '500' }}>10.10.2010</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <MaterialCommunityIcons
                name='sofa-single-outline'
                size={50}
                color='black'
              />
              <View style={{ justifyContent: 'space-around' }}>
                <Text style={{ fontWeight: '500' }}>Phòng 4</Text>
                <Text
                  numberOfLines={1}
                  style={{ fontWeight: '500', width: 96 }}
                >
                  Ghế H1, H2, H3, H4
                </Text>
              </View>
            </View>
          </View>

          {/* Đường kẻ */}
          <View style={styles.breakLine1} />

          {/* Thông tin giá tiền, địa điểm */}
          <View style={{ gap: 10 }}>
            <View style={styles.ticketDetail2}>
              <FontAwesome name='money' size={24} color='black' />
              <Text
                style={{ alignSelf: 'center', fontSize: 18, fontWeight: '700' }}
              >
                210.000 VND
              </Text>
            </View>

            <View style={styles.ticketDetail2}>
              <MaterialCommunityIcons
                name='map-marker-outline'
                size={24}
                color='black'
              />
              <Text
                style={{ alignSelf: 'center', fontSize: 18, fontWeight: '700' }}
              >
                Vincom Ocean Park
              </Text>
            </View>

            <Text
              style={{
                marginLeft: 20 + 24 + 10,
                paddingBottom: 10,
                width: '80%',
              }}
            >
              Tầng 4, Vincom Ocean Park, Da Ton, Gia Lam, Ha Noi
            </Text>

            <View style={styles.ticketDetail2}>
              <Octicons name='note' size={24} color='black' />
              <Text style={styles.alightCenter}>
                Đưa mã QR này cho nhân viên để nhận vé
              </Text>
            </View>
          </View>

          {/* Đường kẻ */}
          <View>
            <View style={{ ...styles.punch, left: -24 }} />
            <View style={{ ...styles.punch, right: -24 }} />
            <View style={styles.breakLine2} />
          </View>

          {/* Mã QR */}
          <View style={{ alignItems: 'center' }}>
            <QRCode
              value='66010ef6d82009222e7c29dd'
              size={Platform.OS == 'android' ? 120 : 140}
            />
            <Text style={{ padding: 20 }}>
              Mã giao dịch: 66010ef6d82009222e7c29dd
            </Text>
          </View>
        </View>
      </ScrollView>
    </ContainerComponent>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    height: 720,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    gap: 20,
    padding: 20,
  },
  movieCover: {
    width: 125,
    height: 175,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  movieTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 30,
  },
  movieDetailContainer: {
    flexDirection: 'row',
    gap: 5,
    alignContent: 'center',
  },
  alightCenter: {
    alignSelf: 'center',
  },
  movieCens: {
    width: '90%',
    fontSize: 14,
    alignSelf: 'center',
  },
  movieDuration: {
    flexDirection: 'row',
    gap: 5,
    alignContent: 'center',
  },
  ticketDetail1: {
    flexDirection: 'row',
    left: 20,
    marginTop: 20,
  },
  movieTime: {
    flexDirection: 'row',
    width: '45%',
    gap: 10,
  },
  breakLine1: {
    height: 1,
    backgroundColor: '#000',
    margin: 20,
  },
  ticketDetail2: {
    flexDirection: 'row',
    marginLeft: 20,
    gap: 10,
    alignItems: 'center',
  },
  breakLine2: {
    height: 1,
    margin: 24,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#9c9c9c',
  },
  punch: {
    height: 48,
    width: 48,
    backgroundColor: '#000',
    borderRadius: 999,
    position: 'absolute',
  },
  backButton: {
    position: 'absolute',
    left: '5%',
  },
})

export default TicketDetailScreen
