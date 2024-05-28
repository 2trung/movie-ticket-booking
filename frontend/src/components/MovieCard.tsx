import {  FlatList,
    Image,
    View,
    StyleSheet,
    Text,
    Pressable,
    Dimensions
} from 'react-native'
import { useRef } from 'react'
import { UnixToTime } from '../utils/timeConvert'
import { Ionicons } from '@expo/vector-icons'

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
    item: movie,
    index: any,
    handleSelectMovie: any
}
const SCREEN_WIDTH = Dimensions.get('window').width
const POSTER_WIDTH = SCREEN_WIDTH > 180 * 2 + 20 ? 180 : SCREEN_WIDTH / 2 - 20
const MovieCard: React.FC<ContainerComponentProps> = ({
    item, 
    index,
    handleSelectMovie}) => {
    const flatListRef = useRef(null)
    return (
        <Pressable
            key={index}
            style={{ width: POSTER_WIDTH }}
            onPress={() => handleSelectMovie(item)}
            >
                <Image
                source={{ uri: item.poster }}
                style={styles.Poster}
                />
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <Text numberOfLines={2} style={styles.Title}>
                    {item.title}
                </Text>

                <View>
                    <View style={styles.InfoContainer}>
                    <Ionicons name='videocam-outline' size={16} color='#F2F2F2' />

                    <Text
                        numberOfLines={1}
                        style={{ color: '#F2F2F2', width: '80%' }}
                    >
                        {item.genres.join(', ')}
                    </Text>
                    </View>
                    <View style={styles.InfoContainer}>
                    <Ionicons name='calendar-outline' size={16} color='#F2F2F2' />

                    <Text style={{ color: '#F2F2F2' }}>
                        {UnixToTime(item?.releaseDate)}
                    </Text>
                    </View>
                </View>
                </View>
                <View style={{ height: 24 }} />
            </Pressable>
    )
    }

const styles = StyleSheet.create({
    Poster: {
        width: POSTER_WIDTH,
        height: POSTER_WIDTH * 1.4,
        borderRadius: 16,
    },
    Title: {
        color: '#FCC434',
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 16,
    },
    InfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
})

export default MovieCard