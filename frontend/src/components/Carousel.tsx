import {
  FlatList,
  Image,
  View,
  Dimensions,
  StyleSheet,
  Text,
  Pressable,
} from 'react-native'
import {  useRef, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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

interface ContainerComponentProps {
  data: Array<movie>
  handleSelectMovie: any
}
const WIDTH = Dimensions.get('window').width
const PADDING = (WIDTH - 300) / 2
const Carousel: React.FC<ContainerComponentProps> = ({
  data,
  handleSelectMovie,
}) => {
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

  return (
    <View style={{ alignItems: 'center' }}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        snapToOffsets={[...Array(data.length).keys()].map(
          (i) => i * (WIDTH * 0.8 - 40) + (i - 1) * 50 + PADDING
        )}
        snapToAlignment='start'
        scrollEventThrottle={16}
        decelerationRate='fast'
        showsHorizontalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        contentContainerStyle={{
          paddingHorizontal: (WIDTH - 300) / 2 - 10,
        }}
        renderToHardwareTextureAndroid={true}
        ItemSeparatorComponent={() => (
          <View style={{ width: 10, backgroundColor: 'transparent' }} />
        )}
        renderItem={({ item, index }) => (
          <Pressable
            style={{ width: WIDTH * 0.8 - 20, marginHorizontal: 10 }}
            onPress={() => handleSelectMovie(item)}
          >
            <Image
              source={{ uri: item.poster }}
              resizeMode='cover'
              style={styles.image}
            />
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text numberOfLines={1} style={styles.heading2}>
                {item.title}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#BFBFBF', alignSelf: 'center' }}>
                  {item.duration > 60
                    ? `${Math.floor(item.duration / 60)}h${
                        item.duration % 60 !== 0 ? `${item.duration % 60}m` : ''
                      }`
                    : `${item.duration}m`}
                </Text>
                <Text style={{ color: '#BFBFBF' }}>•</Text>
                <Text style={{ color: '#BFBFBF' }}>
                  {item.genres.join(', ')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name='star' size={20} color='#FCC434' />
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginHorizontal: 5,
                  }}
                >
                  {item.rating}
                </Text>
                <Text style={{ color: '#BFBFBF' }}>({item.rating_count})</Text>
              </View>
            </View>
          </Pressable>
        )}
      />

      <FlatList
        data={data}
        horizontal
        scrollEnabled={false}
        style={{ position: 'relative', paddingTop: 10 }}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.pagination,
              {
                backgroundColor: activeIndex === index ? '#FCC434' : '#686868',
              },
            ]}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 300,
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
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 30,
  },
})

export default Carousel
