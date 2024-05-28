import {
  Ionicons,
  AntDesign,
  Octicons,
  MaterialCommunityIcons,
  FontAwesome,
} from '@expo/vector-icons'

import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import { useEffect } from 'react'
import {
  getTicketDetail,
  ticketDetailSelector,
} from '../../redux/reducers/ticketReducer'
import { useDispatch, useSelector } from 'react-redux'

import ContainerComponent from '../../components/ContainerComponent'
import FetchingApi from '../../components/FetchingApi'

interface TicketDetail {
  order_id: string
  schedule_id: string
  start_time: string
  room_number: string
  movie_title: string
  movie_poster: string
  movie_genres: Array<string>
  movie_duration: number
  cinema_name: string
  cinema_location: string
  selectedSeats: Array<string>
  total: number
  order_time: string
  status: string
}

const TicketDetailScreen = ({ route, navigation }) => {
  const WIDTH = Dimensions.get('window').width
  const dispatch = useDispatch()

  const ticketDetail: TicketDetail = useSelector(ticketDetailSelector)

  useEffect(() => {
    dispatch(getTicketDetail(route.params.orderId) as any)
  }, [])

  if (!ticketDetail) return <FetchingApi />

  return (
    <ContainerComponent>
      <ScrollView>
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
            <Image
              source={{ uri: ticketDetail.movie_poster }}
              style={styles.movieCover}
            />
            <View style={{ width: WIDTH * 0.9 - 125 - 60, paddingTop: 20 }}>
              <Text numberOfLines={2} style={styles.movieTitle}>
                {ticketDetail.movie_title}
              </Text>
              <View style={styles.movieDetailContainer}>
                <AntDesign
                  name='clockcircleo'
                  size={16}
                  color='black'
                  style={styles.alightCenter}
                />
                <Text numberOfLines={1} style={styles.alightCenter}>
                  {ticketDetail.movie_duration > 60
                    ? `${Math.floor(ticketDetail.movie_duration / 60)} giờ ${
                        ticketDetail.movie_duration % 60
                      } phút`
                    : `${ticketDetail.movie_duration} phút`}
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
                  {ticketDetail.movie_genres.join(', ')}
                </Text>
              </View>
            </View>
          </View>

          {/* Thông tin thời gian, số ghế */}
          <View style={styles.ticketDetail1}>
            <View style={styles.movieTime}>
              <AntDesign name='calendar' size={50} color='black' />
              <View style={{ justifyContent: 'space-around' }}>
                <Text style={{ fontWeight: '500' }}>
                  {new Date(ticketDetail.start_time).getHours()}
                  {'h'}
                  {new Date(ticketDetail.start_time).getMinutes() < 10
                    ? '0' + new Date(ticketDetail.start_time).getMinutes()
                    : new Date(ticketDetail.start_time).getMinutes()}
                  {"'"}
                </Text>
                <Text style={{ fontWeight: '500' }}>
                  {new Date(ticketDetail.start_time).getDate() +
                    '.' +
                    new Date(ticketDetail.start_time).getMonth() +
                    '.' +
                    new Date(ticketDetail.start_time).getFullYear()}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <MaterialCommunityIcons
                name='sofa-single-outline'
                size={50}
                color='black'
              />
              <View style={{ justifyContent: 'space-around' }}>
                <Text style={{ fontWeight: '500' }}>
                  Phòng {ticketDetail.room_number}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ fontWeight: '500', width: 96 }}
                >
                  Ghế({ticketDetail.selectedSeats.length}){': '}
                  {ticketDetail.selectedSeats.join(', ')}
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
                {ticketDetail.total.toLocaleString('vi-VN')} VND
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
                {ticketDetail.cinema_name}
              </Text>
            </View>

            <Text
              style={{
                marginLeft: 20 + 24 + 10,
                paddingBottom: 10,
                width: '80%',
              }}
            >
              {ticketDetail.cinema_location}
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
              value={ticketDetail.order_id}
              size={Platform.OS == 'android' ? 120 : 140}
            />
            <Text style={{ padding: 20 }}>
              Mã giao dịch: {ticketDetail.order_id}
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
    fontWeight: '700',
    marginBottom: 10,
    // lineHeight: 30,
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
