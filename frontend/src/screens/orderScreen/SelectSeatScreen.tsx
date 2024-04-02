import {
  View,
  Text,
  ScrollView,
  Platform,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import CustomHeader from '../../components/CustomHeader'
import { AntDesign } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
// import { getScheduleAPI } from '../../apis/movieApi'

interface data {
  _id: string
  movie_id: string
  room_id: string
  start_time: string
  end_time: string
  reserved_seats: string[]
  row: number
  column: number
  room_number: string
  seats: string[]
}

const SelectSeatScreen = ({ navigation }) => {
  const [data, setData] = useState<Array<data>>()
  const [currentSchedule, setCurrentSchedule] = useState<data>()
  // useEffect(() => {
  //   getScheduleAPI('6601191c2b92ef72463fc86d', '66010ef6d82009222e7c29dd')
  //     .then((data) => {
  //       setData(data)
  //       setCurrentSchedule(data[0])
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // }, [])
  const [row, setRow] = useState(10)
  const [column, setColumn] = useState(10)
  useEffect(() => {
    if (currentSchedule) {
      setRow(currentSchedule.row)
      setColumn(currentSchedule.column)
    }
  }, [currentSchedule])
  const [selectedSeats, setSelectedSeats] = useState([])

  const checkSeat = (seat) => {
    console.log(seat)
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((item) => item !== seat))
      return false
    } else {
      setSelectedSeats([...selectedSeats, seat])
      return true
    }
  }
  const seats = Array.from({ length: row }, (_, i) =>
    String.fromCharCode(65 + i)
  ).map((letter) =>
    Array.from({ length: column }, (_, i) => `${letter}${i + 1}`)
  )

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
                <TouchableOpacity key={index} style={styles.seatAvailable}>
                  <Text style={styles.textSeatAvailable}>{seat}</Text>
                </TouchableOpacity>
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

        {/* Chọn thời gian */}
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <CustomHeader text='Chọn thời gian' variant='heading1' />
          <View style={styles.selectMonthContainerSelected}>
            <Text style={styles.monthTextSelected}>Tháng</Text>
            <Text style={styles.monthTextSelected}>12</Text>
            <View style={styles.dateContainerSelected}>
              <Text style={styles.dateTextSelected}>10</Text>
            </View>
          </View>

          <View style={styles.hourContainerSelected}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>14:30</Text>
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
            51.000VND
          </Text>
        </View>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('PaymentScreen')}
        >
          <Text style={{ color: '#000', fontSize: 20, fontWeight: '700' }}>
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
  textSeatSelected: { color: '#000', fontSize: 12 },
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
    position: 'absolute',
    bottom: 0,
    // borderTopColor: '#333333',
    // borderTopWidth: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000',
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
