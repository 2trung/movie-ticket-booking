import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native'
import ContainerComponent from '../../components/ContainerComponent'
import CustomHeader from '../../components/CustomHeader'
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { useEffect } from 'react'
import { convertDateTime } from '../../utils/convertDateTime'
import { useIsFocused } from '@react-navigation/native'
import { ticketSelector, getTickets } from '../../redux/reducers/ticketReducer'
import { useDispatch, useSelector } from 'react-redux'
import FetchingApi from '../../components/FetchingApi'

interface Ticket {
  order_id: string
  schedule_id: string
  start_time: string
  movie_name: string
  movie_poster: string
  cinema_name: string
  cinema_location: string
}

const TicketsScreen = ({ navigation }) => {
  const dispatch = useDispatch()

  const isFocused = useIsFocused()

  useEffect(() => {
    dispatch(getTickets() as any)
  }, [isFocused])

  const tickets: Array<Ticket> = useSelector(ticketSelector)

  if (!tickets) return <FetchingApi />
  return (
    <ContainerComponent>
      <ScrollView
        style={{ paddingHorizontal: 10 }}
        contentContainerStyle={{
          alignItems: 'center',
        }}
      >
        <CustomHeader
          text='Vé của tôi'
          variant='title'
          style={{ color: '#fff', paddingBottom: 20 }}
        />
        {tickets?.map((ticket, index) => (
          <TouchableOpacity
            key={index}
            style={styles.ticketContainer}
            onPress={() =>
              navigation.navigate('TicketDetailScreen', {
                orderId: ticket.order_id,
              })
            }
          >
            {/* poster phim */}
            <Image
              source={{ uri: ticket.movie_poster }}
              style={{
                height: 140,
                width: 100,
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
              }}
            />

            <View style={{ top: '5%' }}>
              {/* <CustomHeader text={ticket.movie_name} variant='heading2' /> */}
              <Text style={styles.movieTitle} numberOfLines={1}>
                {ticket.movie_name}
              </Text>
              <View style={styles.tiketInfoTitle}>
                <MaterialCommunityIcons
                  name='map-marker-outline'
                  size={24}
                  color='#fff'
                />
                <Text style={styles.tiketInfo}>{ticket.cinema_name}</Text>
              </View>

              <View style={styles.tiketInfoTitle}>
                <AntDesign name='calendar' size={24} color='#fff' />
                <Text style={styles.tiketInfo}>
                  {convertDateTime(ticket.start_time)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ContainerComponent>
  )
}
const styles = StyleSheet.create({
  ticketContainer: {
    backgroundColor: '#1C1C1C',
    height: 140,
    width: '100%',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  tiketInfoTitle: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  tiketInfo: {
    fontSize: 14,
    color: '#fff',
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 30,
    width: '90%',
  },
})

export default TicketsScreen
