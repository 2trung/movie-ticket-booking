import {
  View,
  Text,
  ScrollView,
  Platform,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import FetchingApi from '../../components/FetchingApi'
import { AntDesign } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import {
  scheduleDetailSelector,
  getScheduleDetail,
  createOrder,
} from '../../redux/reducers/orderReducer'
import { useSelector, useDispatch } from 'react-redux'

interface Room {
  _id: string
  room_number: string
  cinema_name: string
  cinema_location: string
  cinema_id: string
  row: number
  column: number
  seats: string[]
}

interface PendingSeat {
  order_id: string
  seats: string[]
  expTime: string
}

interface ScheduleData {
  _id: string
  movie_id: string
  room_id: string
  start_time: string
  end_time: string
  reserved_seats: string[]
  pending_seats: PendingSeat[]
  price: number
  row: number
  column: number
  room_number: string
  seats: string[]
  room: Room
}

const SelectSeatScreen = ({ route, navigation }) => {
  const dispatch = useDispatch()

  const [row, setRow] = useState(0)
  const [column, setColumn] = useState(0)

  const [selectingSeats, setSelectingSeats] = useState<string[]>([])
  const [unavailableSeat, setUnavailableSeat] = useState<string[]>([])

  const scheduleDetail: ScheduleData = useSelector(scheduleDetailSelector)

  useEffect(() => {
    dispatch(getScheduleDetail(route?.params?.scheduleId) as any)
  }, [])

  //Update giao diện khi có dữ liệu
  useEffect(() => {
    if (scheduleDetail) {
      let pending_seats = []
      scheduleDetail?.pending_seats?.map((item) =>
        pending_seats.push(...item.seats)
      )
      setUnavailableSeat([...scheduleDetail?.reserved_seats, ...pending_seats])
      setRow(scheduleDetail?.room?.row)
      setColumn(scheduleDetail?.room?.column)
    }
  }, [scheduleDetail])

  const seats = Array.from({ length: row }, (_, i) =>
    String.fromCharCode(65 + i)
  ).map((letter) =>
    Array.from({ length: column }, (_, i) => `${letter}${i + 1}`)
  )

  const handleSelectSeat = (seat: string) => {
    if (unavailableSeat.includes(seat)) return
    if (selectingSeats.includes(seat)) {
      setSelectingSeats(selectingSeats.filter((item) => item !== seat))
    } else {
      setSelectingSeats([...selectingSeats, seat])
    }
  }

  const handleCreateOrder = async () => {
    if (selectingSeats.length === 0) return Alert.alert('Vui lòng chọn ghế')
    dispatch(
      createOrder({
        scheduleId: scheduleDetail._id,
        seats: selectingSeats,
      }) as any
    )
    navigation.navigate('PaymentScreen')
  }

  if (!scheduleDetail) return <FetchingApi />
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Tiêu đề trang */}
        <View style={styles.titleContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name='arrowleft' size={36} color='#fff' />
          </TouchableOpacity>
          <Text style={styles.title}>Chọn ghế</Text>
        </View>
        {/* Màn chiếu */}
        <View>
          <View style={styles.screen} />
          <LinearGradient
            colors={['rgba(252, 196, 52, 0.5)', '#000', 'transparent']}
            locations={[0, 0.7, 1]}
            style={{ height: 84 }}
          />
          <View style={styles.screenEdgeLeft} />
          <View style={styles.screenEdgeRight} />
        </View>
        {/* Ghế */}
        <View style={{ gap: 10 }}>
          {seats.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={{ flexDirection: 'row', justifyContent: 'space-around' }}
            >
              {row.map((seat, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSelectSeat(seat)}
                  style={
                    unavailableSeat.includes(seat)
                      ? styles.seatUnavailable
                      : selectingSeats.includes(seat)
                      ? styles.seatSelected
                      : styles.seatAvailable
                  }
                >
                  <Text
                    style={
                      unavailableSeat.includes(seat)
                        ? styles.textSeatUnavailable
                        : selectingSeats.includes(seat)
                        ? styles.textSeatSelected
                        : styles.textSeatAvailable
                    }
                  >
                    {seat}
                  </Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
        {/* Chú thích */}
        <View style={styles.explanationContainer}>
          <View style={styles.seatExplanationContainer}>
            <View
              style={{ ...styles.seatExplanation, backgroundColor: '#1C1C1C' }}
            />
            <Text style={{ color: '#fff' }}>Có sẵn</Text>
          </View>
          <View style={styles.seatExplanationContainer}>
            <View
              style={{ ...styles.seatExplanation, backgroundColor: '#261D08' }}
            />
            <Text style={{ color: '#fff' }}>Ko có sẵn</Text>
          </View>
          <View style={styles.seatExplanationContainer}>
            <View
              style={{ ...styles.seatExplanation, backgroundColor: '#FCC434' }}
            />
            <Text style={{ color: '#fff' }}>Đã chọn</Text>
          </View>
        </View>
      </ScrollView>

      {/* Tổng tiền */}
      <View style={styles.footer}>
        <View
          style={{
            position: 'absolute',
            height: 1,
            top: 0,
            backgroundColor: '#333',
            width: '100%',
            // zIndex: 1,
          }}
        />
        <View>
          <Text style={{ color: '#fff' }}>Tổng</Text>
          <Text style={{ color: '#FCC434', fontSize: 24, fontWeight: '900' }}>
            {(selectingSeats.length * scheduleDetail?.price).toLocaleString(
              'vi-VN'
            )}{' '}
            VNĐ
          </Text>
        </View>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleCreateOrder()}
        >
          <Text
            style={{
              color: '#000',
              fontSize: 20,
              fontWeight: '700',
            }}
          >
            Mua vé
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: '5%',
  },
  container: {
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
    paddingBottom: 106,
  },
  scrollViewContainer: {
    marginBottom: 168,
    paddingHorizontal: 10,
  },
  titleContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    color: '#f2f2f2',
    fontSize: 28,
    fontWeight: 'bold',
  },
  screen: {
    zIndex: 1,
    height: 3,
    backgroundColor: '#FCC434',
    borderRadius: 2,
    marginHorizontal: 40,
  },
  screenEdgeLeft: {
    width: 0,
    height: 0,
    position: 'absolute',
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 42,
    borderTopWidth: 84,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#000',
  },
  screenEdgeRight: {
    width: 0,
    height: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 42,
    borderTopWidth: 84,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#000',
  },
  seatAvailable: {
    height: 28,
    width: 28,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },

  seatUnavailable: {
    height: 28,
    width: 28,
    backgroundColor: '#261D08',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  seatSelected: {
    height: 28,
    width: 28,
    backgroundColor: '#FCC434',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  textSeatAvailable: { color: '#BFBFBF', fontSize: 12 },
  textSeatUnavailable: { color: '#FCC434', fontSize: 12 },
  textSeatSelected: { color: '#000', fontSize: 12, fontWeight: 'bold' },
  seatExplanationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  seatExplanation: {
    height: 24,
    width: 24,
    borderRadius: 4,
  },
  explanationContainer: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  selectMonthContainer: {
    marginTop: 20,
    height: 104,
    width: 52,
    backgroundColor: '#1C1C1C',
    borderRadius: 32,
    alignItems: 'center',
  },
  selectMonthContainerSelected: {
    marginTop: 20,
    height: 104,
    width: 52,
    backgroundColor: '#FCC434',
    borderRadius: 32,
    alignItems: 'center',
  },
  dateContainer: {
    width: 44,
    height: 44,
    backgroundColor: '#3B3B3B',
    position: 'absolute',
    borderRadius: 999,
    bottom: 4,
    left: 4,
  },
  dateContainerSelected: {
    width: 44,
    height: 44,
    backgroundColor: '#1D1D1D',
    position: 'absolute',
    borderRadius: 999,
    bottom: 4,
    left: 4,
  },
  monthText: { color: '#fff', top: 16 },
  monthTextSelected: { color: '#000', top: 16 },
  dateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 44,
  },
  dateTextSelected: {
    color: '#F2F2F2',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 44,
  },
  hourContainer: {
    marginTop: 20,
    width: 90,
    height: 36,
    borderRadius: 36,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourContainerSelected: {
    marginTop: 20,
    width: 90,
    height: 36,
    borderRadius: 36,
    backgroundColor: '#261D08',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#FCC434',
    borderWidth: 1,
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    // borderTopColor: '#333333',
    // borderTopWidth: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    // justifyContent: 'center',
  },
  footerButton: {
    backgroundColor: '#FCC434',
    height: 56,
    width: 150,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
export default SelectSeatScreen
