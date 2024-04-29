import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
  Pressable,
  Alert,
} from 'react-native'
import { AntDesign, Octicons } from '@expo/vector-icons'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getMovieSchedules,
  scheduleSelector,
} from '../../redux/reducers/orderReducer'

import FetchingApi from '../../components/FetchingApi'

interface cinema {
  cinema_id: string
  cinema_name: string
  cinema_location: string
}

interface schedule {
  cinema: cinema
  times: Array<{
    schedule_id: string
    time: string
  }>
}
interface MovieSchedule {
  date: string
  schedule: Array<schedule>
}

const SelectCinemaDateTime = ({ route, navigation }) => {
  const dispatch = useDispatch()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedScheduleId, setSelectedScheduleId] = useState('')
  const [selectedCinema, setSelectedCinema] = useState<cinema>()
  const data: Array<MovieSchedule> = useSelector(scheduleSelector)

  useEffect(() => {
    dispatch(getMovieSchedules(route?.params?.movieId) as any)
  }, [])

  const schedules = data?.find(
    (item) => item.date === selectedDate.toISOString().slice(0, 10)
  )

  useEffect(() => {
    setSelectedScheduleId(schedules?.schedule[0]?.times[0]?.schedule_id || '')
  }, [selectedDate])
  useEffect(() => {
    if (!schedules) return
    for (const schedule of schedules.schedule) {
      for (const time of schedule.times) {
        if (selectedScheduleId === time?.schedule_id) {
          setSelectedCinema(schedule.cinema)
        }
      }
    }
  }, [selectedScheduleId])
  const handleSelectSchedule = () => {
    if (selectedScheduleId === '') {
      return Alert.alert(
        'Chưa suất chiếu nào được chọn',
        'Vui lòng chọn một suất chiếu'
      )
    }
    navigation.navigate('SelectSeatScreen', {
      scheduleId: selectedScheduleId,
    })
  }

  const daysOfWeek = [
    'Chủ nhật',
    'Thứ hai',
    'Thứ ba',
    'Thứ tư',
    'Thứ năm',
    'Thứ sáu',
    'Thứ bảy',
  ]
  const currentDate = new Date()
  const weekDates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate)
    date.setDate(currentDate.getDate() + i)
    weekDates.push(date)
  }
  const renderItem = ({ item }) => (
    <Pressable
      style={{
        paddingVertical: 10,
        width: 100,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor:
          item.getDate() === selectedDate.getDate() ? '#261D08' : '#000',
      }}
      onPress={() => setSelectedDate(item)}
    >
      <Text
        style={
          item.getDate() === selectedDate.getDate()
            ? styles.daySelected
            : styles.day
        }
      >
        {daysOfWeek[item.getDay()]}
      </Text>
      <Text
        style={
          item.getDate() === selectedDate.getDate()
            ? styles.dateSelected
            : styles.date
        }
      >
        {item.getDate()} / {item.getMonth() + 1}
      </Text>
    </Pressable>
  )
  if (!data) return <FetchingApi />
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}
    >
      <ScrollView>
        <View style={styles.titleContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name='arrowleft' size={36} color='#fff' />
          </TouchableOpacity>
          <Text style={styles.title}>Chọn suất chiếu</Text>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={weekDates}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
        <Text
          style={{
            color: '#F2F2F2',
            alignSelf: 'center',
            paddingVertical: 20,
          }}
        >
          {daysOfWeek[selectedDate.getDay()]} {selectedDate.getDate()}
          {', tháng '}
          {selectedDate.getMonth() + 1}
          {' năm '}
          {selectedDate.getFullYear()}
        </Text>

        {schedules ? (
          <View>
            {schedules?.schedule?.map((item) => (
              <View
                key={item.cinema.cinema_id}
                style={{
                  paddingHorizontal: 20,
                  marginBottom: 10,
                  backgroundColor: '#1C1C1C',
                  paddingVertical: 20,
                  borderRadius: 5,
                  marginHorizontal: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => setSelectedCinema(item.cinema)}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}
                  >
                    {item.cinema?.cinema_name}
                  </Text>
                  {item.cinema?.cinema_id === selectedCinema?.cinema_id ? (
                    <Octicons
                      name='chevron-up'
                      size={24}
                      color='#f2f2f2'
                      style={{ position: 'absolute', right: 0 }}
                    />
                  ) : (
                    <Octicons
                      name='chevron-down'
                      size={24}
                      color='#f2f2f2'
                      style={{ position: 'absolute', right: 0 }}
                    />
                  )}
                </TouchableOpacity>
                {item.cinema?.cinema_id === selectedCinema?.cinema_id && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {item.times.map((time) => (
                      <TouchableOpacity
                        key={time?.schedule_id}
                        style={
                          selectedScheduleId === time?.schedule_id
                            ? styles.timeContainerSelected
                            : styles.timeContainer
                        }
                        onPress={() => setSelectedScheduleId(time?.schedule_id)}
                      >
                        <Text style={{ color: '#F2F2F2', alignSelf: 'center' }}>
                          {time.time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  // <FlatList
                  //   horizontal
                  //   showsHorizontalScrollIndicator={false}
                  //   data={item.times}
                  //   style={{ marginTop: 10 }}
                  //   renderItem={({ item }) => (
                  //     <TouchableOpacity
                  //       style={
                  //         selectedSchedule === item.schedule_id
                  //           ? styles.timeContainerSelected
                  //           : styles.timeContainer
                  //       }
                  //       onPress={() => setSelectedSchedule(item.schedule_id)}
                  //     >
                  //       <Text style={{ color: '#F2F2F2', alignSelf: 'center' }}>
                  //         {item.time}
                  //       </Text>
                  //     </TouchableOpacity>
                  //   )}
                  // />
                )}
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ color: '#fff', alignSelf: 'center' }}>
            Không có lịch chiếu
          </Text>
        )}
      </ScrollView>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.footerContinueButton}
          onPress={() => handleSelectSchedule()}
        >
          <Text style={{ fontSize: 20, fontWeight: '700' }}>Tiếp tục</Text>
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
  titleContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    color: '#f2f2f2',
    fontSize: 28,
    fontWeight: 'bold',
  },
  day: {
    color: '#fff',
  },
  daySelected: {
    color: '#FCC434',
  },
  date: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  dateSelected: {
    color: '#FCC434',
    fontSize: 16,
    fontWeight: '900',
  },
  timeContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#575757',
  },
  timeContainerSelected: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#261D08',
    borderWidth: 1,
    borderColor: '#FCC434',
  },
  footerContainer: {
    position: 'absolute',
    paddingVertical: 20,
    paddingHorizontal: 10,
    bottom: 0,
    width: '100%',
    backgroundColor: '#000',
    gap: 20,
  },
  footerContinueButton: {
    height: 56,
    backgroundColor: '#FCC434',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 48,
  },
})

export default SelectCinemaDateTime
