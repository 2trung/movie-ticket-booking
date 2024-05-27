import {
    Image,
    View,
    StyleSheet,
    Text,
} from 'react-native'

interface person {
    _id: string
    photo: any
    name: string
}

interface ContainerComponentProps {
    actor: person
}

const PersonCard: React.FC<ContainerComponentProps> = ({ actor }) => {
    return(
        <View style={styles.personContainer}>
            <Image
                source={{ uri: actor.photo }}
                style={styles.personPhoto}
            />
            <View style={{ justifyContent: 'center' }}>
                <Text style={{ color: '#f2f2f2' }}>
                {actor.name.split(' ').length > 1
                    ? actor.name.split(' ')[0]
                    : actor.name}
                </Text>
                {actor.name.split(' ').length > 1 && (
                <Text style={{ color: '#f2f2f2' }} numberOfLines={1}>
                    {actor.name.split(' ').slice(1).join(' ')}
                </Text>
                )}
            </View>
        </View>
    )

}
const styles = StyleSheet.create({
    personPhoto: { height: 36, width: 36, borderRadius: 999 },
    footerContainer: {
      position: 'absolute',
      paddingVertical: 20,
      paddingHorizontal: 10,
      bottom: 0,
      width: '100%',
      backgroundColor: '#000',
      gap: 20,
    },
    personContainer: {
        width: 150,
        padding: 10,
        backgroundColor: '#1C1C1C',
        flexDirection: 'row',
        gap: 10,
        borderRadius: 12,
      },
})

export default PersonCard