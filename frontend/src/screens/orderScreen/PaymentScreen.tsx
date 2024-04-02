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
} from 'react-native'

import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  Feather,
} from '@expo/vector-icons'

import CustomHeader from '../../components/CustomHeader'

const PaymentScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollViewContainer}>
        {/* Tiêu đề trang */}
        <View style={styles.titleContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name='arrowleft' size={36} color='#fff' />
          </TouchableOpacity>
          <Text style={styles.title}>Thanh toán</Text>
        </View>

        {/* Thông tin phim */}
        <View style={styles.movieContainer}>
          <View style={styles.movieCover} />

          <View style={{ justifyContent: 'center' }}>
            <CustomHeader
              text='Avengers: Infinity War'
              variant='heading2'
              style={{ color: '#FCC434' }}
            />
            <View style={styles.movieInfoContainer}>
              <Ionicons name='videocam-outline' size={24} color='#fff' />
              <Text numberOfLines={1} style={styles.movieInfoText}>
                Hành động, Phiêu lưu, Tâm lý
              </Text>
            </View>
            <View style={styles.movieInfoContainer}>
              <MaterialCommunityIcons
                name='map-marker-outline'
                size={24}
                color='#fff'
              />
              <Text style={styles.movieInfoText}>Vincom Ocean Park</Text>
            </View>

            <View style={styles.movieInfoContainer}>
              <AntDesign name='calendar' size={24} color='#fff' />
              <Text style={styles.movieInfoText}>14h15' • 16.12.2022</Text>
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
              66010ef6d82009222e7c29dd
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
              {/* Giới hạn ký tự ở đây */}
              A1, A2, A3
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
              333.000 VND
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
          <View style={styles.paymentMethodContainer}>
            {/* Ảnh phương thức thanh toán */}
            <View
              style={{
                height: 48,
                width: 86,
                backgroundColor: '#fff',
                borderRadius: 8,
                marginHorizontal: 16,
              }}
            />
            <Text style={styles.paymentMethodName}>123 Pay</Text>
            <Feather
              name='chevron-right'
              size={24}
              color='#F2F2F2'
              style={{ position: 'absolute', right: 20 }}
            />
          </View>

          <View style={styles.paymentMethodContainer_active}>
            <View
              style={{
                height: 48,
                width: 86,
                backgroundColor: '#fff',
                borderRadius: 8,
                marginHorizontal: 16,
              }}
            />
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#f2f2f2' }}>
              123 Pay
            </Text>
            <Feather
              name='chevron-right'
              size={24}
              color='#F2F2F2'
              style={{ position: 'absolute', right: 20 }}
            />
          </View>
          <View style={styles.paymentMethodContainer}>
            {/* Ảnh phương thức thanh toán */}
            <View
              style={{
                height: 48,
                width: 86,
                backgroundColor: '#fff',
                borderRadius: 8,
                marginHorizontal: 16,
              }}
            />
            <Text style={styles.paymentMethodName}>123 Pay</Text>
            <Feather
              name='chevron-right'
              size={24}
              color='#F2F2F2'
              style={{ position: 'absolute', right: 20 }}
            />
          </View>
          <View style={styles.paymentMethodContainer}>
            {/* Ảnh phương thức thanh toán */}
            <View
              style={{
                height: 48,
                width: 86,
                backgroundColor: '#fff',
                borderRadius: 8,
                marginHorizontal: 16,
              }}
            />
            <Text style={styles.paymentMethodName}>123 Pay</Text>
            <Feather
              name='chevron-right'
              size={24}
              color='#F2F2F2'
              style={{ position: 'absolute', right: 20 }}
            />
          </View>
          <View style={styles.paymentMethodContainer}>
            {/* Ảnh phương thức thanh toán */}
            <View
              style={{
                height: 48,
                width: 86,
                backgroundColor: '#fff',
                borderRadius: 8,
                marginHorizontal: 16,
              }}
            />
            <Text style={styles.paymentMethodName}>123 Pay</Text>
            <Feather
              name='chevron-right'
              size={24}
              color='#F2F2F2'
              style={{ position: 'absolute', right: 20 }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <View style={styles.footerTimeContainer}>
          <Text style={styles.footerTimeText}>Hoàn thành thanh toán trong</Text>
          <Text style={styles.footerTimeText}>14:59</Text>
        </View>
        <TouchableOpacity style={styles.footerContinueButton}>
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
  paymentMethodContainer_active: {
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
