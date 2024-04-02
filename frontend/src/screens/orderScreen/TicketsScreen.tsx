import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import ContainerComponent from '../../components/ContainerComponent'
import CustomHeader from '../../components/CustomHeader'
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'

const TicketsScreen = ({ navigation }) => {
  return (
    <ContainerComponent>
      <ScrollView
        style={{ paddingHorizontal: 10 }}
        contentContainerStyle={{
          alignItems: 'center',
        }}
      >
        <CustomHeader
          text='Vé của tôi'
          variant='title'
          style={{ color: '#fff', paddingBottom: 20 }}
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('TicketDetailScreen')}
        >
          {/* poster phim */}
          <View
            style={{
              backgroundColor: '#fff',
              height: 140,
              width: 100,
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: 12,
            }}
          />

          <View style={{ top: '5%' }}>
            <CustomHeader text='Avengers: Infinity War' variant='heading2' />
            <View style={styles.tiketInfoTitle}>
              <MaterialCommunityIcons
                name='map-marker-outline'
                size={24}
                color='#fff'
              />
              <Text style={styles.tiketInfo}>Vincom Ocean Park</Text>
            </View>

            <View style={styles.tiketInfoTitle}>
              <AntDesign name='calendar' size={24} color='#fff' />
              <Text style={styles.tiketInfo}>14h15' • 16.12.2022</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </ContainerComponent>
  )
}
const styles = StyleSheet.create({
  backButton: {
    backgroundColor: '#1C1C1C',
    height: 140,
    width: '100%',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 20,
  },
  tiketInfoTitle: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  tiketInfo: {
    fontSize: 14,
    color: '#fff',
  },
})

export default TicketsScreen
