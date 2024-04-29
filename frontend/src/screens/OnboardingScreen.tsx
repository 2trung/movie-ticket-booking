import { Button } from 'react-native-paper'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
} from 'react-native'
import { useEffect, useRef, useState } from 'react'

const OnboardingScreen = ({ navigation }) => {
  const DATA = [
    {
      image: require('../assets/dune.jpg'),
    },
    {
      image: require('../assets/spiderman.jpg'),
    },
    {
      image: require('../assets/topgun.jpg'),
    },
  ]
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    const currentIndex = viewableItems[0]?.index
    if (currentIndex !== undefined) {
      setActiveIndex(currentIndex)
    }
  }
  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: {
        itemVisiblePercentThreshold: 50,
      },
      onViewableItemsChanged,
    },
  ])

  const [activeIndex, setActiveIndex] = useState(0)

  const flatListRef = useRef(null)

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (activeIndex === DATA.length - 1) {
        flatListRef.current.scrollToIndex({ index: 0 })
      } else {
        flatListRef.current.scrollToIndex({ index: activeIndex + 1 })
      }
    }, 3000)
    return () => {
      clearTimeout(timerId)
    }
  }, [activeIndex])
  const footerLink = [
    'Điều khoản sử dụng',
    'Chính sách bảo mật',
    'Hỗ trợ',
    'Liên hệ',
  ]
  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          color: '#FCC434',
          fontSize: 36,
          marginLeft: 50,
          marginBottom: 10,
        }}
      >
        Logo
      </Text>

      <View style={{ alignItems: 'center' }}>
        <FlatList
          ref={flatListRef}
          data={DATA}
          horizontal
          renderItem={({ item, index }) => (
            <View
              style={{
                width: Dimensions.get('window').width,
              }}
            >
              <Image
                source={item.image}
                resizeMode='cover'
                style={styles.image}
              />
            </View>
          )}
          pagingEnabled
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
        />
        <FlatList
          data={DATA}
          horizontal
          scrollEnabled={false}
          style={{ position: 'relative', paddingTop: 10 }}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.pagination,
                {
                  backgroundColor:
                    activeIndex === index ? '#FCC434' : '#686868',
                },
              ]}
            />
          )}
        />
      </View>

      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={styles.line} />
        <View>
          <Text style={{ alignSelf: 'center', color: '#fff' }}>Đăng ký</Text>
          <Text style={{ alignSelf: 'center', color: '#fff' }}>
            Để nhận ưu đãi
          </Text>
        </View>
        <View style={styles.line} />
      </View>

      <Button
        mode='contained'
        buttonColor='#FCC434'
        textColor='#000'
        labelStyle={styles.textButton}
        style={styles.button}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Đăng nhập
      </Button>

      <Button
        mode='outlined'
        textColor='#fff'
        labelStyle={styles.textButton}
        style={styles.button}
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Đăng ký
      </Button>

      <View style={styles.footerLinkContainer}>
        {footerLink.map((item, index) => (
          <TouchableOpacity key={index}>
            <Text style={styles.footerText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  text: {
    color: '#fff',
    alignSelf: 'center',
  },
  footerText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 10,
  },
  textButton: {
    fontSize: 16,
    lineHeight: 30,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 10,
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: Platform.OS === 'android' ? 10 : 0,
    justifyContent: 'space-between',
  },
  footerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'gray',
    marginHorizontal: 20,
  },
  image: {
    width: 320,
    height: 450,
    alignSelf: 'center',
    borderRadius: 20,
  },
  pagination: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
})

export default OnboardingScreen
