import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Pressable,
  ScrollView,
  Modal,
} from 'react-native'
import { useState, useEffect } from 'react'
import { AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import FetchingApi from '../../components/FetchingApi'
import CustomHeader from '../../components/CustomHeader'
import { RouteProp } from '@react-navigation/native'

import PersonCard from '../../components/PersonCard'
import { useSelector } from 'react-redux'
import {
  getMovieDetail,
  movieDetailSelector,
} from '../../redux/reducers/movieReducer'
import { useDispatch } from 'react-redux'
import { WebView } from 'react-native-webview'

import { UnixToTime } from '../../utils/timeConvert'

type RootStackParamList = {
  MovieDetailScreen: { movieId: string }
}

interface MovieScreenProps {
  route: RouteProp<RootStackParamList, 'MovieDetailScreen'>
}

interface people {
  _id: string
  name: string
  photo: string
}

interface MovieDetailProps {
  _id: string
  title: string
  description: string
  releaseDate: string
  duration: number
  genres: Array<string>
  cast: Array<people>
  director: people
  trailer: string
  cens: string
  poster: string
  rating: number
  rating_count: string
  isPlaying: boolean
}

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 60)
  const remainingMinutes = duration % 60
  if (hours === 0) {
    return `${remainingMinutes}p`
  } else {
    return `${hours}g${remainingMinutes}p`
  }
}

const MovieDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch()
  const movieDetail = useSelector(movieDetailSelector)
  const stars = [1, 2, 3, 4, 5]
  const [selectedStar, setSelectedStar] = useState(0)

  useEffect(() => {
    const movieId = route.params.movieId
    dispatch(getMovieDetail(movieId) as any)
  }, [])

  const [showMore, setShowMore] = useState(false)
  const [watchTrailer, setWatchTrailer] = useState(false)
  const handleWatchTrailer = () => {
    setWatchTrailer(true)
  }
  if (!movieDetail) return <FetchingApi />
  return (
    <View
      style={{
        ...styles.container,
        paddingBottom: movieDetail?.isPlaying ? 100 : 0,
      }}
    >
      <ScrollView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name='arrowleft' size={36} color='#fff' />
        </TouchableOpacity>
        <Image source={{ uri: movieDetail?.poster }} style={styles.cover} />

        <View style={styles.mainFrame}>
          <View>
            <CustomHeader text={movieDetail?.title} variant='heading2' />
            <Text style={{ color: '#BFBFBF' }}>
              {formatDuration(movieDetail?.duration)}
              {' • '}
              {UnixToTime(movieDetail?.releaseDate)}
            </Text>
          </View>
          <View>
            <Text style={styles.boldText}>
              <Text>
                Đánh giá{' '}
                <MaterialCommunityIcons name='star' size={20} color='#FCC434' />{' '}
                {movieDetail?.rating}{' '}
              </Text>
              <Text style={{ color: '#BFBFBF', fontSize: 12 }}>
                ({movieDetail?.rating_count})
              </Text>
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', gap: 5 }}>
                {stars.map((_, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setSelectedStar(index + 1)}
                  >
                    <MaterialCommunityIcons
                      name='star'
                      size={32}
                      color={selectedStar > index ? '#FCC434' : '#575757'}
                    />
                  </Pressable>
                ))}
              </View>
              <TouchableOpacity
                style={styles.trailerButton}
                onPress={() => handleWatchTrailer()}
              >
                <Ionicons name='play' size={16} color='#bfbfbf' />
                <Text style={{ color: '#bfbfbf' }}> Xem trailer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.generalInfoContainer}>
          <View>
            <Text style={styles.regularText}>Thể loại:</Text>
            <Text style={styles.regularText}>Censorship:</Text>
            <Text style={styles.regularText}>Quốc gia:</Text>
          </View>
          <View>
            <Text style={styles.boldText}>
              {movieDetail?.genres.join(', ')}
            </Text>
            <Text style={styles.boldText}>{movieDetail?.cens}</Text>
            <Text style={styles.boldText}>Mỹ</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <CustomHeader
            text='Nội dung'
            variant='heading1'
            style={{ paddingVertical: 20 }}
          />
          <Text style={{ color: '#F2F2F2' }}>
            {showMore
              ? movieDetail?.description
              : movieDetail?.description.substring(0, 200) + '... '}
            <Text
              style={{ color: '#FCC434', fontSize: 12 }}
              onPress={() => setShowMore(!showMore)}
            >
              {showMore ? ' Thu gọn' : ' Xem thêm'}
            </Text>
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <CustomHeader
            text='Đạo diễn'
            variant='heading1'
            style={{ paddingVertical: 20 }}
          />
          <PersonCard actor={movieDetail?.director} />
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <CustomHeader
            text='Diễn viên'
            variant='heading1'
            style={{ paddingVertical: 20 }}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {movieDetail?.cast.map((actor) => (
              <PersonCard key={actor._id} actor={actor} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      {movieDetail?.isPlaying && (
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.footerContinueButton}
            onPress={() =>
              navigation.navigate('SelectCinemaDateTime', {
                movieId: movieDetail?._id,
              })
            }
          >
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Đặt vé</Text>
          </TouchableOpacity>
        </View>
      )}
      {watchTrailer && (
        <Modal
          animationType='fade'
          transparent={true}
          visible={watchTrailer}
          onRequestClose={() => {
            setWatchTrailer(false)
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                height: 250,
                width: '100%',
                // zIndex: 1,
                position: 'absolute',
                // borderBlockColor: '#FCC434',
              }}
            >
              <TouchableOpacity>
                <AntDesign
                  name='close'
                  size={36}
                  color='#fff'
                  onPress={() => setWatchTrailer(false)}
                />
              </TouchableOpacity>
              <WebView
                source={{
                  uri: movieDetail?.trailer,
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cover: { width: '100%', height: 240 },
  backButton: {
    position: 'absolute',
    left: '5%',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    zIndex: 1,
  },
  mainFrame: {
    height: 200,
    backgroundColor: '#1C1C1C',
    marginHorizontal: 20,
    width: '90%',
    borderRadius: 16,
    padding: 20,
    position: 'absolute',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight + 120 : 120,
  },
  boldText: {
    color: '#F2F2F2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  regularText: { color: '#CDCDCD', fontSize: 16 },
  generalInfoContainer: {
    flexDirection: 'row',
    marginTop: 150,
    alignSelf: 'flex-start',
    gap: 20,
    paddingHorizontal: 20,
  },
  trailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 4,
    borderColor: '#bfbfbf',
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
  footerContinueButton: {
    height: 56,
    backgroundColor: '#FCC434',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 48,
  },
})

export default MovieDetailScreen
