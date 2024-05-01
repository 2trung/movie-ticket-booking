import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Pressable,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native'
import { useEffect, useState } from 'react'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import {
  searchMovie,
  searchResultSelector,
  searchStateSelector,
} from '../../redux/reducers/searchReducer'
import { useDispatch, useSelector } from 'react-redux'
import FetchingApi from '../../components/FetchingApi'
import { UnixToTime } from '../../utils/timeConvert'

interface Movie {
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

const SCREEN_WIDTH = Dimensions.get('window').width
const POSTER_WIDTH = SCREEN_WIDTH > 180 * 2 + 20 ? 180 : SCREEN_WIDTH / 2 - 20

const SearchMovieScreen = ({ route, navigation }) => {
  const [notFound, setNotFound] = useState(false)
  const dispatch = useDispatch()
  const searchResult: Array<Movie> = useSelector(searchResultSelector)
  const isLoading = useSelector(searchStateSelector)

  useEffect(() => {
    if (route?.params?.query === '') {
      return
    }
    dispatch(searchMovie(route?.params?.query) as any)
  }, [])

  useEffect(() => {
    if (searchResult.length === 0) {
      setNotFound(true)
    } else {
      setNotFound(false)
    }
  }, [searchResult])

  if (isLoading) return <FetchingApi />
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}
    >
      <View style={{ marginBottom: 20, alignItems: 'center' }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name='arrowleft' size={36} color='#fff' />
        </TouchableOpacity>
        <Text style={{ color: '#f2f2f2', fontSize: 28, fontWeight: 'bold' }}>
          Kết quả tìm kiếm
        </Text>
      </View>
      {notFound ? (
        <Text
          style={{
            color: '#f2f2f2',
            alignSelf: 'center',
          }}
        >
          Không tìm thấy kết quả
        </Text>
      ) : (
        <FlatList
          data={searchResult}
          contentContainerStyle={{
            paddingVertical: 10,
          }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item, index }) => (
            <Pressable
              key={index}
              style={{ width: POSTER_WIDTH }}
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

                    <Text
                      numberOfLines={1}
                      style={{ color: '#F2F2F2', width: '80%' }}
                    >
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
                      {UnixToTime(item?.releaseDate)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ height: 24 }} />
            </Pressable>
          )}
          numColumns={2}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  selected: {
    backgroundColor: '#FCC434',
    width: '50%',
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselected: {
    width: '50%',
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonPoster: {
    width: POSTER_WIDTH,
    height: POSTER_WIDTH * 1.4,
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
  backButton: {
    position: 'absolute',
    left: '5%',
  },
})

export default SearchMovieScreen
