import { useEffect, useState } from "react";
import React from "react";
import EncryptedStorage from "react-native-encrypted-storage";
// import { Box, HStack, ScrollView } from 'native-base'

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView,
    FlatList,
    ToastAndroid
} from "react-native"


import {
    BORDERRADIUS,
    COLORS,
    FONTSIZE,
    SPACING,
} from '../../theme/theme'
import { StatusUp } from "iconsax-react-native";
import { IconButton } from "react-native-paper";
import Toast from "react-native-toast-message";


const timeArray: string[] = [
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "14:30",
    "15:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "22:00",
    "23:30"
];

const generateDate = () => {
    const date = new Date()
    let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    let weekdays = []

    for (let i = 0; i < 7; i++) {
        let tempDate = {
            date: new Date(date.getTime() + i * 60 * 60 * 24 * 1000).getDate(),
            day: weekday[new Date(date.getTime() + i * 60 * 60 * 24 * 1000).getDay()]

        }

        weekdays.push(tempDate)
    }
    return weekdays;
}



const generateSeats = () => {
    let numrow = 9
    let numColum = 10
    let rowArray = []
    let start = 1


    for (let i = 0; i < numrow; i++) {
        let columArray = []
        for (let j = 0; j < numColum; j++) {
            let SeatObject = {
                number: start,
                selected: false
            };
            columArray.push(SeatObject);
            start++
        }


        rowArray.push(columArray)
    };
    return rowArray;
};


const SelectSeatScreen = ({ navigation, route }: any) => {
    const [dateArray, setDateArray] = useState<any>(generateDate);
    const [selectDateIndex, setselectDateIndex] = useState<any>();
    const [price, setPrice] = useState<number>(0);

    const [twoDseatArray, setTwoDseatArray] = useState<any[][]>(generateSeats());
    const [selectedSeatArray, setSelectedSeatArray] = useState([]);

    const [selectTimeIndex, setSelectTimeIndex] = useState<any>();

    // console.log(JSON.stringify(twoDseatArray, null, 2))

    const selectSeat = (index: number, subitem: number, num: number) => {
        if (!twoDseatArray[index][subitem].taken) {
            let array: any = [...selectedSeatArray]
            let temp = [...twoDseatArray]
            temp[index][subitem].selected = !temp[index][subitem].selected
            if (!array.includes(num)) {
                array.push(num)
                setSelectedSeatArray(array)
            } else {
                const tempIndex = array.indexOf(num);
                if (tempIndex > -1) {
                    array.splice(tempIndex, 1)
                    setSelectedSeatArray(array)
                }
            }
            setPrice(array.length * 75000.0)
            setTwoDseatArray(temp)

        }
    };

    const BookSeats = async () => {
        if (
            selectedSeatArray.length !== 0 && timeArray[selectTimeIndex] != undefined && dateArray[selectDateIndex] != undefined
        ) {
            try {
                await EncryptedStorage.setItem('ticket', JSON.stringify({
                    seatArray: selectedSeatArray,
                    time: timeArray[selectTimeIndex],
                    date: dateArray[selectDateIndex],
                }))
            } catch (error) {
                console.error('', error)
            }
            navigation.navigate('Ticket', {
                seatArray: selectedSeatArray,
                time: timeArray[selectTimeIndex],
                date: dateArray[selectDateIndex],
            })
        } else (
            ToastAndroid.showWithGravity(
                'Vui lòng chọn chỗ ngồi, ngày và giờ của buổi diễn',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            )
        )

    }


    return (
        <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
            <StatusBar hidden />
            <View style={{ flexDirection: 'row', width: '100%', height: 60 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../assets/arrow-left.png')} style={{ height: '100%', position: "absolute", marginLeft: 10 }}></Image>
                </TouchableOpacity>
                <Text style={{ color: '#ffffff', fontSize: 20, marginLeft: 150, fontWeight: "bold", marginTop: 20 }}>Select seat</Text>
            </View>

            <View style={{ height: 40, width: '100%' }}>

            </View>
            <View style={[styles.seatContainer]}>
                <View style={styles.containerGap20}>
                    {
                        twoDseatArray?.map((item, index) => {
                            return (
                                <View key={index} style={styles.seatRow}>
                                    {item?.map((subitem, subindex) => {
                                        return (
                                            <TouchableOpacity key={subitem.number} onPress={() => {
                                                selectSeat(index, subindex, subitem.number);
                                            }}>
                                                <IconButton icon='seat'
                                                    iconColor="#ffffff"
                                                    size={12}
                                                    style={[
                                                        subitem.taken ? { backgroundColor: COLORS.Orange } : {},
                                                        subitem.selected ? { backgroundColor: COLORS.Yellow } : {}
                                                    ]}
                                                />

                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            )
                        })
                    }

                </View>
                <View style={styles.seatsquareContainer}>
                    <View style={styles.squareContainer}>
                        <IconButton icon="square" />
                        <Text style={styles.squareText}>Available</Text>
                    </View>
                    <View style={[styles.squareContainer]}>
                        <IconButton icon="square"
                            iconColor='#ffa500' />
                        <Text style={styles.squareText}>Reserved</Text>
                    </View>
                    <View style={[styles.squareContainer]}>
                        <IconButton icon="square"
                            iconColor="#ffff00" />
                        <Text style={styles.squareText}>Selected</Text>
                    </View>

                </View>
            </View>
            <View style={styles.selectDateTime}>
                <Text style={styles.textSelectDateTime}>Select Date & Time</Text>
            </View>

            <View>
                <FlatList data={dateArray}
                    keyExtractor={item => item.date}
                    horizontal
                    bounces={false}
                    contentContainerStyle={styles.containerGap24}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => setselectDateIndex(index)}>
                                <View style={[
                                    styles.dateContainer,
                                    index == 0
                                        ? { marginLeft: SPACING.space_24 }
                                        : index == dateArray.length - 1
                                            ? { marginRight: SPACING.space_24 }
                                            : {},
                                    index == selectDateIndex ? { backgroundColor: COLORS.Yellow } : {},

                                ]} >

                                    <Text style={styles.dataText}>{item.date}</Text>

                                    <View style={styles.dayContainer}>
                                        <Text style={styles.dayText}>{item.day}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>

            <View>
                <FlatList data={timeArray}
                    keyExtractor={item => item}
                    horizontal
                    bounces={false}
                    contentContainerStyle={styles.containerGap24}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => setSelectTimeIndex(index)}>
                                <View style={[
                                    styles.timeContainer,
                                    index == 0
                                        ? { marginLeft: SPACING.space_24 }
                                        : index == dateArray.length - 1
                                            ? { marginRight: SPACING.space_24 }
                                            : {},
                                    index == selectTimeIndex ? { backgroundColor: COLORS.Yellow } : {},

                                ]} >

                                    <Text style={styles.timeText}>{item}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>

            <View style={styles.buttonPriceContainer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.textTotal}>Total</Text>
                    <Text style={styles.price}>{price} VND</Text>
                </View>
                <TouchableOpacity onPress={() => { }}>
                    <Text style={styles.buttomText}>Buy Ticket</Text>
                </TouchableOpacity>
            </View>


        </ScrollView >
    )
}
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: COLORS.Black,
    },
    seatContainer: {
        marginVertical: SPACING.space_20,

    },
    containerGap20: {
        gap: 1
    },
    seatRow: {
        flexDirection: 'row',
        justifyContent: "center"
    },
    seatsquareContainer: {
        flexDirection: 'row',
        marginVertical: SPACING.space_2,
        alignItems: "center",
        justifyContent: 'space-evenly'
    },
    squareContainer: {
        flexDirection: 'row',
        gap: SPACING.space_10,
        alignItems: 'center',
        marginTop: 1
    },
    selectDateTime: {
        alignItems: "center",
        justifyContent: "center"
    },
    textSelectDateTime: {
        fontSize: FONTSIZE.size_20,
        color: COLORS.White,
        fontWeight: 'bold',
    },

    squareText: {
        fontSize: FONTSIZE.size_12,
        color: COLORS.White
    },
    containerGap24: {
        gap: SPACING.space_24
    },
    dateContainer: {
        width: SPACING.space_10 * 7,
        height: SPACING.space_10 * 15,
        borderRadius: SPACING.space_10 * 10,
        borderWidth: 1,
        borderBlockColor: '#1C1C1C',
        backgroundColor: '#1C1C1C',
        alignItems: "center",
        justifyContent: "flex-start",
    },
    dataText: {
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
        marginTop: 15
    },
    dayText: {
        fontSize: FONTSIZE.size_12,
        color: COLORS.White,
    },
    dayContainer: {
        width: SPACING.space_4 * 12,
        height: SPACING.space_4 * 12,
        borderRadius: 30,
        borderBlockColor: '#3B3B3B',
        backgroundColor: '#3B3B3B',
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50
    },
    timeContainer: {
        paddingVertical: SPACING.space_10,
        paddingHorizontal: SPACING.space_20,
        borderWidth: 1,
        borderColor: COLORS.WhiteRGBA50,
        fontSize: FONTSIZE.size_12,
        color: '#ffffff',
        borderRadius: BORDERRADIUS.radius_20,
        backgroundColor: COLORS.DarkGrey,
        alignItems: "center",
        justifyContent: "center",
    },
    timeText: {
        fontSize: FONTSIZE.size_14,
        color: COLORS.White,
    },
    buttonPriceContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 25
    },
    priceContainer: {
        alignItems: 'center',
    },
    price: {
        fontSize: FONTSIZE.size_24,
        color: COLORS.Yellow,
        marginLeft: 35
    },
    buttomText: {
        borderRadius: BORDERRADIUS.radius_25,
        paddingHorizontal: SPACING.space_28,
        paddingVertical: SPACING.space_15,
        fontSize: FONTSIZE.size_16,
        fontWeight: "bold",
        color: COLORS.Black,
        backgroundColor: COLORS.Yellow,
        marginRight: 25
    },
    textTotal: {
        fontSize: 14,
        color: COLORS.White,

    }



})

export default SelectSeatScreen

