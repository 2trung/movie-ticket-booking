import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { useEffect, useState } from 'react'

import MovieCard from '../../components/MovieCard'
import { useDispatch } from 'react-redux'
import { setOrder } from '../../redux/reducers/orderReducer'
import { moviesSelector } from '../../redux/reducers/movieReducer'
import { useSelector } from 'react-redux'

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


const MovieScreen: React.FC<MovieScreenProps> = ({ route, navigation }) => {
  const [isNowPlaying, setIsNowPlaying] = useState(true)
  const moviesData = useSelector(moviesSelector)

  const nowPlaying = moviesData.nowPlaying
  const comingSoon = moviesData.comingSoon

  useEffect(() => {
    {
      route?.params?.type &&
        setIsNowPlaying(route?.params?.type === 'nowPlaying')
    }
  }, [route?.params?.type])

  const dispatch = useDispatch()
  const handleSelectMovie = (movie: movie) => {
    dispatch(setOrder(movie))
    navigation.navigate('MovieDetailScreen', {
      movieId: movie._id,
    })
  }
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
          <MovieCard item={item}
          index={index}
          handleSelectMovie={handleSelectMovie} 
          />
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
})

export default MovieScreen
