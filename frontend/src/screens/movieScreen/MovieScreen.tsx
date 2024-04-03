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
import { RouteProp } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { getNowPlayingAPI, getComingSoonAPI } from '../../apis/movieApi'
import { Ionicons } from '@expo/vector-icons'
import FetchingApi from '../../components/FetchingApi'

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
type RootStackParamList = {
  MovieScreen: { type: string }
}

interface MovieScreenProps {
  route: RouteProp<RootStackParamList, 'MovieScreen'>
  navigation: any
}

const SCREEN_WIDTH = Dimensions.get('window').width
const POSTER_WIDTH = SCREEN_WIDTH > 180 * 2 + 20 ? 180 : SCREEN_WIDTH / 2 - 20

const MovieScreen: React.FC<MovieScreenProps> = ({ route, navigation }) => {
  const [isNowPlaying, setIsNowPlaying] = useState(true)
  useEffect(() => {
    setIsNowPlaying(route?.params?.type === 'nowPlaying')
  }, [route?.params?.type])
  const [nowPlaying, setNowPlaying] = useState<Array<movie>>([])
  const [comingSoon, setComingSoon] = useState<Array<movie>>([])
  useEffect(() => {
    getNowPlayingAPI().then((res) => {
      setNowPlaying(res.data)
    })
    getComingSoonAPI().then((res) => {
      setComingSoon(res.data)
    })
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}
    >
      <View
        style={{
          height: 56,
          backgroundColor: '#1C1C1C',
          borderRadius: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 4,
        }}
      >
        <TouchableOpacity
          style={isNowPlaying ? styles.selected : styles.unselected}
          onPress={isNowPlaying ? () => {} : () => setIsNowPlaying(true)}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: isNowPlaying ? '#000' : '#BFBFBF',
            }}
          >
            Đang chiếu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={isNowPlaying ? styles.unselected : styles.selected}
          onPress={isNowPlaying ? () => setIsNowPlaying(false) : () => {}}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: isNowPlaying ? '#BFBFBF' : '#000',
            }}
          >
            Sắp chiếu
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={isNowPlaying ? nowPlaying : comingSoon}
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
                  <Ionicons name='videocam-outline' size={16} color='#F2F2F2' />

                  <Text
                    numberOfLines={1}
                    style={{ color: '#F2F2F2', width: '80%' }}
                  >
                    {item.genres.join(', ')}
                  </Text>
                </View>
                <View style={styles.comingSoonInfoContainer}>
                  <Ionicons name='calendar-outline' size={16} color='#F2F2F2' />

                  <Text style={{ color: '#F2F2F2' }}>
                    {item.releaseDate.slice(0, 10).replaceAll('-', '.')}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ height: 24 }} />
          </Pressable>
        )}
        numColumns={2}
      />
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
})

export default MovieScreen
