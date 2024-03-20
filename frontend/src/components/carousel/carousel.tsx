import { FlatList, Image, View, Dimensions } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import AppStyle from '../../theme'

const Carousel = () => {
  const DATA = [
    {
      id: '01',
      image: require('../../../assets/dune.jpg'),
    },
    {
      id: '02',
      image: require('../../../assets/openheimer.jpg'),
    },
    {
      id: '03',
      image: require('../../../assets/godzilla.jpg'),
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

  return (
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
              style={AppStyle.StyleCarousel.image}
            />
          </View>
        )}
        pagingEnabled
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      <FlatList
        data={DATA}
        horizontal
        scrollEnabled={false}
        style={{ position: 'relative', paddingTop: 20 }}
        renderItem={({ item, index }) => (
          <View
            style={[
              AppStyle.StyleCarousel.pagination,
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

export default Carousel
