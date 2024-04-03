import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Pressable,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { userSelector } from '../../redux/reducers/userReducer'

import Carousel from '../../components/Carousel'
import CustomHeader from '../../components/CustomHeader'
import FetchingApi from '../../components/FetchingApi'

import { getHomePageAPI, searchMovieAPI } from '../../apis/movieApi'

import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons'

interface movie {
  _id: string
  title: string
  description: string
  releaseDate: string
  duration: number
  genres: Array<string>
  cast: Array<string>
  director: string
  trailer: string
  cens: string
  poster: string
  rating: number
  rating_count: string
}

interface movieData {
  nowPlaying: Array<movie>
  comingSoon: Array<movie>
}

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState<movieData>()
  useEffect(() => {
    getHomePageAPI()
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
  const user = useSelector(userSelector)

  const [search, setSearch] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [searchResult, setSearchResult] = useState<movie[]>()

  useEffect(() => {
    if (search === '') {
      setSearchResult([])
      return
    }
    searchMovieAPI(search)
      .then((res) => {
        setSearchResult(res.data)
      })
      .catch((err) => {})
  }, [search])

  const handleResultPress = (movieId) => {
    navigation.navigate('MovieDetailScreen', {
      movieId,
    })
  }
  const handleSearch = () => {
    if (search === '') return
    navigation.navigate('SearchMovieScreen', {
      query: search,
    })
  }

  if (!data) return <FetchingApi />
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#000',
      }}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <CustomHeader text='Xin chào 👋' variant='body1' />
            <CustomHeader
              text={user.name ? user.name : 'User'}
              variant='heading2'
            />
          </View>
          <MaterialCommunityIcons name='bell' size={24} color='#fff' />
        </View>

        {/* Tìm kiếm */}
        <View>
          <MaterialCommunityIcons
            name='magnify'
            size={24}
            color='#fff'
            style={{
              position: 'absolute',
              left: 36,
              zIndex: 3,
              top: 12,
            }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder='Tìm kiếm'
            placeholderTextColor={'#8C8C8C'}
            cursorColor={'#fff'}
            value={search}
            onChangeText={(text) => setSearch(text)}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
            // keyboardType='web-search'
            returnKeyType='search'
            onSubmitEditing={handleSearch}
          />

          {search && isTyping && searchResult && searchResult.length > 0 && (
            <View style={styles.searchResultContainer}>
              {searchResult.map((item, index) => (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => handleResultPress(item._id)}
                >
                  <View style={styles.searchResult}>
                    <Text style={{ color: '#fff' }}>{item.title}</Text>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </View>
          )}
        </View>

        {/* Đang chiếu */}
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            <CustomHeader
              text='Đang chiếu'
              variant='heading1'
              style={styles.heading1}
            />
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                navigation.navigate('MovieScreen', { type: 'nowPlaying' })
              }}
            >
              <Text style={{ color: '#FCC434' }}>Xem thêm</Text>
              <Feather name='chevron-right' size={14} color='#FCC434' />
            </TouchableOpacity>
          </View>
          <Carousel
            data={
              data?.nowPlaying?.length > 5
                ? data?.nowPlaying?.slice(0, 5)
                : data?.nowPlaying
            }
            navigation={navigation}
          />
        </View>
        {/* Coming soon */}
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            <CustomHeader
              text='Sắp chiếu'
              variant='heading1'
              style={styles.heading1}
            />
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                navigation.navigate('MovieScreen', { type: 'comingSoon' })
              }}
            >
              <Text style={{ color: '#FCC434' }}>Xem thêm</Text>
              <Feather name='chevron-right' size={14} color='#FCC434' />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={data?.comingSoon}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 20 }}
            renderItem={({ item, index }) => (
              <Pressable
                style={{ width: 180 }}
                onPress={() =>
                  navigation.navigate('MovieDetailScreen', {
                    movieId: item._id,
                  })
                }
              >
                <Image
                  source={{ uri: item.poster }}
                  style={styles.comingSoonPoster}
                />
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                  <Text numberOfLines={2} style={styles.comingSoonTitle}>
                    {item.title}
                  </Text>

                  <View>
                    <View style={styles.comingSoonInfoContainer}>
                      <Ionicons
                        name='videocam-outline'
                        size={16}
                        color='#F2F2F2'
                      />

                      <Text numberOfLines={1} style={{ color: '#F2F2F2' }}>
                        {item.genres.join(', ')}
                      </Text>
                    </View>
                    <View style={styles.comingSoonInfoContainer}>
                      <Ionicons
                        name='calendar-outline'
                        size={16}
                        color='#F2F2F2'
                      />

                      <Text style={{ color: '#F2F2F2' }}>
                        {item.releaseDate.slice(0, 10).replaceAll('-', '.')}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            )}
          />
        </View>

        {/* Discount */}
        <View>
          <CustomHeader
            text='Khuyến mãi'
            variant='heading1'
            style={styles.heading1}
          />
          <Image
            source={{ uri: 'https://i.imgur.com/OQBcJrR.jpeg' }}
            // width={400}
            height={200}
            resizeMode='cover'
            style={{
              marginHorizontal: 20,
              borderRadius: 16,
              marginBottom: 20,
            }}
          ></Image>
        </View>

        {/* News */}
        {/* <View>
          <CustomHeader
            text='Phân loại'
            variant='heading1'
            style={styles.heading1}
          />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
  },
  searchInput: {
    backgroundColor: '#1C1C1C',
    height: 48,
    borderRadius: 8,
    marginHorizontal: 20,
    paddingLeft: 50,
    paddingRight: 20,
    color: '#fff',
    zIndex: 2,
  },
  heading1: {
    paddingVertical: 20,
  },
  comingSoonPoster: {
    width: 180,
    height: 250,
    borderRadius: 16,
  },
  comingSoonTitle: {
    color: '#FCC434',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  comingSoonInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  searchResultContainer: {
    width: '100%',
    position: 'absolute',
    paddingTop: 50,
    paddingBottom: 20,
    zIndex: 1,
    backgroundColor: '#000',
  },
  searchResult: {
    backgroundColor: '#1C1C1C',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
})

export default HomeScreen
