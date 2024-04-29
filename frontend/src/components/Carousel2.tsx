import { FlatList, Image, View, Dimensions, StyleSheet } from 'react-native'
import { useEffect, useRef, useState } from 'react'

const Carousel = () => {
  const DATA = [
    {
      id: '01',
      image: require('../assets/dune.jpg'),
    },
    {
      id: '02',
      image: require('../assets/spiderman.jpg'),
    },
    {
      id: '03',
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
              style={styles.image}
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

export default Carousel
