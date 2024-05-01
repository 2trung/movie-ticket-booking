import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  FlatList,
} from 'react-native'
import ContainerComponent from '../../components/ContainerComponent'
import { useEffect, useState } from 'react'
import FetchingApi from '../../components/FetchingApi'
import { convertDateTime } from '../../utils/convertDateTime'
import { AntDesign } from '@expo/vector-icons'
import { setOrder } from '../../redux/reducers/orderReducer'
import Toast from 'react-native-toast-message'
import { useSelector, useDispatch } from 'react-redux'
import {
  getOrdersHistory,
  orderSelector,
} from '../../redux/reducers/ticketReducer'
import { cancelOrder } from '../../redux/reducers/orderReducer'

const OrderHistoryScreen = ({ navigation }) => {
  const [selecting, setSelecting] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const dispatch = useDispatch()
  const orders = useSelector(orderSelector)

  useEffect(() => {
    dispatch(getOrdersHistory() as any)
  }, [refreshKey])

  const handleRePayment = async (orderId: string) => {
    navigation.navigate('PaymentScreen', { orderId })
  }

  const handleCancelOrder = async (orderId) => {
    dispatch(cancelOrder(orderId) as any)
    setRefreshKey(refreshKey + 1)
  }
  const handleViewDetail = async (order: any) => {
    if (order.status === 'pending')
      selecting === order.order_id
        ? setSelecting('')
        : setSelecting(order.order_id)
    if (order.status === 'success')
      navigation.navigate('TicketDetailScreen', {
        orderId: order.order_id,
      })
  }

  if (!orders) return <FetchingApi />
  return (
    <ContainerComponent>
      <View style={{ backgroundColor: '#000', paddingHorizontal: 10 }}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('TabNavigator')}
          >
            <AntDesign name='arrowleft' size={36} color='#fff' />
          </TouchableOpacity>
          <Text
            style={{
              color: '#f2f2f2',
              fontSize: 28,
              fontWeight: 'bold',
              paddingBottom: 10,
            }}
          >
            Lịch sử đơn hàng
          </Text>
        </View>

        <FlatList
          data={orders}
          keyExtractor={(item) => item.order_id}
          renderItem={({ item }) => (
            <View>
              <Pressable
                onPress={() => handleViewDetail(item)}
                style={{
                  height: 140,
                  backgroundColor: '#1C1C1C',
                  borderRadius: 10,
                  flexDirection: 'row',
                  gap: 20,
                  marginTop: 10,
                }}
              >
                <Image
                  source={{ uri: item.movie_poster }}
                  style={{
                    height: 140,
                    width: 100,
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  }}
                />
                <View>
                  <Text style={styles.movieTitle} numberOfLines={1}>
                    {item.movie_name.length > 24
                      ? item.movie_name.slice(0, 20) + '...'
                      : item.movie_name}
                  </Text>
                  <Text style={{ color: '#BFBFBF' }}>Mã đơn hàng:</Text>
                  <Text style={{ color: '#f2f2f2' }}>{item.order_id}</Text>
                  <Text numberOfLines={1} style={{ color: '#BFBFBF' }}>
                    Thời gian đặt vé: {convertDateTime(item.order_time)}
                  </Text>
                  <Text style={{ color: '#BFBFBF' }}>
                    Trạng thái:{' '}
                    <Text
                      style={{
                        color:
                          item.status === 'success'
                            ? '#22bb33'
                            : item.status === 'pending'
                            ? '#f0ad4e'
                            : '#bb2124',
                      }}
                    >
                      {item.status === 'success'
                        ? 'Hoàn thành'
                        : item.status === 'pending'
                        ? 'Chưa thanh toán'
                        : 'Đã huỷ'}
                    </Text>
                  </Text>
                  <Text style={{ color: '#BFBFBF' }}>
                    Tổng:{' '}
                    <Text
                      style={{
                        color: '#f2f2f2',
                        fontSize: 18,
                        fontWeight: 'bold',
                        justifyContent: 'center',
                      }}
                    >
                      {item.total.toLocaleString('vi-VN')} VND
                    </Text>
                  </Text>
                </View>
              </Pressable>
              {item.status === 'pending' && (
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    gap: 10,
                    backgroundColor: '#1C1C1C',
                    borderRadius: 10,
                    padding: 10,
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: '#261D08',
                      borderColor: '#FCC434',
                      borderWidth: 0.5,
                      padding: 10,
                      borderRadius: 10,
                      // marginTop: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => handleCancelOrder(item.order_id)}
                  >
                    <Text style={{ color: '#f2f2f2', fontSize: 16 }}>
                      Huỷ đơn hàng
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: '#fcc434',
                      padding: 10,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => handleRePayment(item.order_id)}
                  >
                    <Text style={{ color: '#000', fontSize: 16 }}>
                      Thanh toán
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />

        {/* {orders.map((order) => (
          <View key={order.order_id}>
            <Pressable
              onPress={() => setSelecting(order.order_id)}
              style={{
                height: 140,
                backgroundColor: '#1C1C1C',
                borderRadius: 10,
                flexDirection: 'row',
                gap: 20,
                marginTop: 10,
              }}
            >
              <Image
                source={{ uri: order.movie_poster }}
                style={{
                  height: 140,
                  width: 100,
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12,
                }}
              />
              <View>
                <Text style={styles.movieTitle} numberOfLines={1}>
                  {order.movie_name.length > 24
                    ? order.movie_name.slice(0, 20) + '...'
                    : order.movie_name}
                </Text>
                <Text style={{ color: '#BFBFBF' }}>Mã đơn hàng:</Text>
                <Text style={{ color: '#f2f2f2' }}>{order.order_id}</Text>
                <Text numberOfLines={1} style={{ color: '#BFBFBF' }}>
                  Thời gian đặt v: {convertDateTime(order.order_time)}
                </Text>
                <Text style={{ color: '#BFBFBF' }}>
                  Trạng thái:{' '}
                  <Text
                    style={{
                      color:
                        order.status === 'success'
                          ? '#22bb33'
                          : order.status === 'pending'
                          ? '#f0ad4e'
                          : '#bb2124',
                    }}
                  >
                    {order.status === 'success'
                      ? 'Hoàn thành'
                      : order.status === 'pending'
                      ? 'Chưa thanh toán'
                      : 'Đã huỷ'}
                  </Text>
                </Text>
                <Text style={{ color: '#BFBFBF' }}>
                  Tổng:{' '}
                  <Text
                    style={{
                      color: '#f2f2f2',
                      fontSize: 18,
                      fontWeight: 'bold',
                      justifyContent: 'center',
                    }}
                  >
                    {order.total.toLocaleString('vi-VN')} VND
                  </Text>
                </Text>
              </View>
            </Pressable>
            {order.order_id === selecting && order.status === 'pending' && (
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  gap: 10,
                  backgroundColor: '#1C1C1C',
                  borderRadius: 10,
                  padding: 10,
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#261D08',
                    borderColor: '#FCC434',
                    borderWidth: 0.5,
                    padding: 10,
                    borderRadius: 10,
                    // marginTop: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() =>
                    navigation.navigate('Payment', {
                      orderId: order.order_id,
                      total: order.total,
                    })
                  }
                >
                  <Text style={{ color: '#f2f2f2', fontSize: 16 }}>
                    Huỷ đơn hàng
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#fcc434',
                    padding: 10,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() =>
                    navigation.navigate('Payment', {
                      orderId: order.order_id,
                      total: order.total,
                    })
                  }
                >
                  <Text style={{ color: '#000', fontSize: 16 }}>
                    Thanh toán
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))} */}
      </View>
    </ContainerComponent>
  )
}
const styles = StyleSheet.create({
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f2f2f2',
    lineHeight: 30,
    // width: '90%',
  },
  backButton: {
    position: 'absolute',
    left: '5%',
  },
})

export default OrderHistoryScreen
