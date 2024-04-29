import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  Feather,
} from '@expo/vector-icons'

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Modal,
  Alert,
} from 'react-native'
import { WebView } from 'react-native-webview'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  createOrder,
  orderSelector,
  createPaymentUrl,
  paymentUrlSelector,
  getOrderDetail,
} from '../../redux/reducers/orderReducer'

import { convertDateTime } from '../../utils/convertDateTime'
import CustomHeader from '../../components/CustomHeader'
import FetchingApi from '../../components/FetchingApi'

const PaymentScreen = ({ route, navigation }) => {
  const dispatch = useDispatch()

  const [time, setTime] = useState(900)
  const [paymentMethod, setPaymentMethod] = useState('')

  const [showWebView, setShowWebView] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const orderDetail = useSelector(orderSelector)
  const paymentUrl = useSelector(paymentUrlSelector)

  useEffect(() => {
    dispatch(createOrder(route?.params) as any)
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev === 0) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handlePayment = async () => {
    if (paymentMethod === '') {
      return Alert.alert(
        'Chưa chọn phương thức thanh toán',
        'Vui lòng một chọn phương thức thanh toán để tiếp tục'
      )
    }
    await dispatch(
      createPaymentUrl({
        orderId: orderDetail?.order_id,
        bankCode: paymentMethod,
      }) as any
    )
    if (paymentUrl) {
      setShowWebView(true)
    }
  }

  const handleCloseWebView = async () => {
    setShowWebView(false)
    await dispatch(getOrderDetail(orderDetail?.order_id) as any)
  }
  // Nếu thanh toán thành công thì chuyển hướng sang màn hình vé đã đặt
  useEffect(() => {
    if (orderDetail.status === 'success') {
      navigation.navigate('TicketsScreen')
    }
  }, [orderDetail])

  const handleConfirmBack = () => {
    setShowConfirmModal(false)
    navigation.navigate('OrderHistoryScreen')
  }
  if (!orderDetail) return <FetchingApi />

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollViewContainer}>
        {/* Tiêu đề trang */}
        <View style={styles.titleContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowConfirmModal(true)}
          >
            <AntDesign name='arrowleft' size={36} color='#fff' />
          </TouchableOpacity>
          <Text style={styles.title}>Thanh toán</Text>
        </View>

        {/* Thông tin phim */}
        <View style={styles.movieContainer}>
          <Image
            source={{
              uri: orderDetail?.movie?.poster || orderDetail?.movie_poster,
            }}
            style={styles.movieCover}
          />

          <View style={{ justifyContent: 'center' }}>
            <CustomHeader
              text={
                orderDetail?.movie_title?.length > 20
                  ? orderDetail?.movie_title.slice(0, 20) + '...'
                  : orderDetail?.movie_title || ''
              }
              variant='heading2'
              style={{ color: '#FCC434' }}
            />
            <View style={styles.movieInfoContainer}>
              <Ionicons name='videocam-outline' size={24} color='#fff' />
              <Text numberOfLines={1} style={styles.movieInfoText}>
                {orderDetail?.movie_genres?.join(', ')}
              </Text>
            </View>
            <View style={styles.movieInfoContainer}>
              <MaterialCommunityIcons
                name='map-marker-outline'
                size={24}
                color='#fff'
              />
              <Text style={styles.movieInfoText}>
                {orderDetail?.cinema?.cinema_name || orderDetail?.cinema_name}
              </Text>
            </View>

            <View style={styles.movieInfoContainer}>
              <AntDesign name='calendar' size={24} color='#fff' />
              {/* <Text style={styles.movieInfoText}>14h15' • 16.12.2022</Text> */}
              <Text style={styles.movieInfoText}>
                {convertDateTime(
                  orderDetail?.schedule?.start_time || orderDetail?.start_time
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* Thông tin giao dịch */}
        <View style={{ paddingVertical: 32, gap: 16 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={{ color: '#F2F2F2' }}>Mã giao dịch</Text>
            <Text
              numberOfLines={1}
              style={{ color: '#F2F2F2', fontWeight: '600' }}
            >
              {orderDetail?.order_id}
            </Text>
          </View>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={{ color: '#F2F2F2' }}>Ghế</Text>
            <Text
              numberOfLines={1}
              style={{
                color: '#F2F2F2',
                fontWeight: '600',
                paddingLeft: '10%',
              }}
            >
              {orderDetail?.selectedSeats?.length > 5
                ? orderDetail?.selectedSeats?.slice(0, 5).join(', ') + '...'
                : orderDetail?.selectedSeats?.join(', ')}
            </Text>
          </View>

          <View
            style={{
              height: 40,
              backgroundColor: '#1C1C1C',
              justifyContent: 'center',
              borderRadius: 12,
            }}
          >
            <MaterialCommunityIcons
              name='brightness-percent'
              size={20}
              color='#F2F2F2'
              style={{ position: 'absolute', left: 10 }}
            />
            <TextInput
              style={{ paddingLeft: 40, paddingRight: 130, color: '#F2F2F2' }}
              cursorColor={'#F2F2F2'}
              placeholderTextColor='#949494'
              placeholder='Mã giảm giá'
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#FCC434',
                position: 'absolute',
                right: 0,
                width: 120,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Áp dụng</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.breakLine1} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#F2F2F2' }}>Tổng</Text>
            <Text
              numberOfLines={1}
              style={{ color: '#FCC434', fontWeight: '600', fontSize: 24 }}
            >
              {orderDetail?.total?.toLocaleString('vi-VN')} VND
            </Text>
          </View>
        </View>

        <CustomHeader
          text='Phương thức thanh toán'
          variant='heading1'
          style={{ color: '#F2F2F2', marginBottom: 20 }}
        />
        {/* Phuong thuc thanh toan */}
        <View style={{ gap: 16 }}>
          <TouchableOpacity
            onPress={() => setPaymentMethod('NCB')}
            style={
              paymentMethod === 'NCB'
                ? styles.paymentMethodContainerSelected
                : styles.paymentMethodContainer
            }
          >
            {/* Ảnh phương thức thanh toán */}
            <View
              style={{
                height: 48,
                width: 86,
                backgroundColor: '#fff',
                borderRadius: 8,
                marginHorizontal: 16,
              }}
            >
              <Image
                source={require('../../assets/napas.png')}
                style={{
                  resizeMode: 'contain',
                  height: '100%',
                  width: '80%',
                  borderRadius: 8,
                  alignSelf: 'center',
                }}
              />
            </View>
            <Text style={styles.paymentMethodName}>Thẻ ngân hàng</Text>
            <Feather
              name='chevron-right'
              size={24}
              color='#F2F2F2'
              style={{ position: 'absolute', right: 20 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPaymentMethod('INTCARD')}
            style={
              paymentMethod === 'INTCARD'
                ? styles.paymentMethodContainerSelected
                : styles.paymentMethodContainer
            }
          >
            <View
              style={{
                height: 48,
                width: 86,
                backgroundColor: '#fff',
                borderRadius: 8,
                marginHorizontal: 16,
              }}
            >
              <Image
                source={require('../../assets/card.jpg')}
                style={{
                  resizeMode: 'contain',
                  height: '100%',
                  width: '100%',
                  borderRadius: 8,
                  alignSelf: 'center',
                  padding: 10,
                }}
              />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#f2f2f2' }}>
              Thẻ thanh toán quốc tế
            </Text>
            <Feather
              name='chevron-right'
              size={24}
              color='#F2F2F2'
              style={{ position: 'absolute', right: 20 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPaymentMethod('qr')}
            style={
              paymentMethod === 'qr'
                ? styles.paymentMethodContainerSelected
                : styles.paymentMethodContainer
            }
          >
            {/* Ảnh phương thức thanh toán */}
            <View
              style={{
                height: 48,
                width: 86,
                backgroundColor: '#fff',
                borderRadius: 8,
                marginHorizontal: 16,
              }}
            >
              <Image
                source={require('../../assets/vnpay-qr.png')}
                style={{
                  resizeMode: 'center',
                  height: '100%',
                  width: '80%',
                  borderRadius: 8,
                  padding: 10,
                  alignSelf: 'center',
                }}
              />
            </View>
            <Text style={styles.paymentMethodName}>VNPay QR</Text>
            <Feather
              name='chevron-right'
              size={24}
              color='#F2F2F2'
              style={{ position: 'absolute', right: 20 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPaymentMethod('vnPay')}
            style={
              paymentMethod === 'vnPay'
                ? styles.paymentMethodContainerSelected
                : styles.paymentMethodContainer
            }
          >
            {/* Ảnh phương thức thanh toán */}
            <View
              style={{
                height: 48,
                width: 86,
                backgroundColor: '#fff',
                borderRadius: 8,
                marginHorizontal: 16,
              }}
            >
              <Image
                source={require('../../assets/vnpay.png')}
                style={{
                  resizeMode: 'center',
                  height: '100%',
                  width: '80%',
                  padding: 10,
                  alignSelf: 'center',
                }}
              />
            </View>
            <Text style={styles.paymentMethodName}>Ví VNPay</Text>
            <Feather
              name='chevron-right'
              size={24}
              color='#F2F2F2'
              style={{ position: 'absolute', right: 20 }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <View style={styles.footerTimeContainer}>
          <Text style={styles.footerTimeText}>Hoàn thành thanh toán trong</Text>
          <Text style={styles.footerTimeText}>
            {('0' + Math.floor(time / 60)).slice(-2)}:
            {('0' + (time % 60)).slice(-2)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.footerContinueButton}
          onPress={() => handlePayment()}
        >
          <Text style={{ fontSize: 20, fontWeight: '700' }}>Thanh toán</Text>
        </TouchableOpacity>
      </View>

      {showConfirmModal && (
        <Modal visible={true} animationType={'none'} transparent={true}>
          <View
            style={{
              flex: 1,
              // backgroundColor: 'rgba(52, 52, 52, 0.8)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#1C1C1C',
                width: '90%',
                borderRadius: 10,
                padding: 10,
                gap: 10,
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 25, marginTop: 5 }}>
                  Quay lại
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    marginTop: 5,
                    color: 'grey',
                    textAlign: 'center',
                  }}
                >
                  Bạn vẫn có thể thanh toán đơn hàng sau khi thoát. Xác nhận
                  quay lại?
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 10,
                  gap: 10,
                  justifyContent: 'space-around',
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setShowConfirmModal(false)}
                  style={{
                    flex: 1,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    borderColor: '#FCC434',
                    borderWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      color: '#FCC434',
                      fontWeight: 'bold',
                      padding: 15,
                    }}
                  >
                    Hủy
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleConfirmBack()}
                  style={{
                    flex: 1,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FCC434',
                  }}
                >
                  <Text
                    style={{ color: '#000', fontWeight: 'bold', padding: 15 }}
                  >
                    Đồng ý
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        animationType='slide'
        transparent={true}
        visible={showWebView}
        onRequestClose={() => handleCloseWebView()}
      >
        <>
          <View
            style={{
              backgroundColor: '#000',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '500' }}>
              Thanh toán đơn hàng
            </Text>
            <TouchableOpacity
              style={{ position: 'absolute', left: 10 }}
              onPress={() => handleCloseWebView()}
            >
              <AntDesign name='close' size={24} color='#fff' />
            </TouchableOpacity>
          </View>
          <WebView
            source={{
              uri: paymentUrl,
            }}
            // onNavigationStateChange={(navState) => {
            //   handleNavigationStateChange(navState)
            // }}
            style={{ flex: 1 }}
          />
        </>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: '5%',
  },
  breakLine1: {
    height: 1,
    backgroundColor: '#595959',
    margin: 20,
  },
  container: {
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  movieContainer: {
    backgroundColor: '#1C1C1C',
    height: 140,
    width: '100%',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 20,
  },
  movieCover: {
    backgroundColor: '#fff',
    height: 140,
    width: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  movieInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  movieInfoText: {
    fontSize: 14,
    color: '#F2F2F2',
  },
  paymentMethodContainer: {
    height: 80,
    backgroundColor: '#1C1C1C',
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f2f2f2',
  },
  paymentMethodContainerSelected: {
    height: 80,
    backgroundColor: '#261D08',
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#FCC434',
    borderWidth: 1,
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
  footerTimeContainer: {
    height: 52,
    backgroundColor: '#261D08',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerTimeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#F2F2F2',
  },
  footerContinueButton: {
    height: 56,
    backgroundColor: '#FCC434',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 48,
  },
})

export default PaymentScreen
