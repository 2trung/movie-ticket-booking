import { RowHorizontal } from 'iconsax-react-native';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, FlatList } from 'react-native';



const MovieDetails = () => {

    const [lines, setLines] = useState(3);

    const onTextPress = () => {
        setLines(lines === 3 ? 0 : 3); 
      };
      
    return (
        <SafeAreaView style= {styles.container}>
            <ScrollView style={{}}>
                <Image style={styles.cover} source={require('../../../src/assets/dune.jpg')}/>
                <View style={styles.main_frame}>
                    <View style={styles.general_info}>
                        <View style={{
                            marginTop: 38,
                            marginLeft: 30,
                            width: '80%',
                            height: 50,
                            alignItems: 'flex-start',
                        }}>
                            <Text style={styles.bold_text}>Movie Name</Text>
                            <Text style={{fontSize: 12, fontWeight: '400', color: '#737373'}}>Duration . release date</Text>
                        </View>
                        <View style={{marginTop: 26}}>
                            <View style={{marginLeft:30, flexDirection: 'row', alignItems: 'flex-start'}}>
                                <Text style={styles.small_bold_text}>Review </Text>
                                <Text style={styles.small_bold_text}>3.6*</Text>
                                <Text style={{fontSize: 12, fontWeight: '300', color: '#737373', marginLeft: 5}}>(1000)</Text>
                            </View>
                            <View style={{marginHorizontal:30 ,flexDirection: 'row',}}>
                                <View style={{backgroundColor: 'white', width: 200, height: 32}}></View>
                                <TouchableOpacity style={{borderColor: '#737373', borderWidth: 1, borderRadius: 4, width: 100, height: 32, paddingTop: 4, alignItems: 'center', marginLeft: 15}}>
                                    <Text style={{fontSize: 14, fontWeight: '500', color: '#737373'}}> Xem trailer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style= {{justifyContent: 'space-between', marginTop: 10}}>
                        <View style= {{marginTop: 15, flexDirection: 'row'}}>
                            <Text style= {styles.normal_text}>Thể loại: </Text>
                            <Text style= {styles.small_bold_text}>Hành cmn động, phiêu lưu vl </Text>
                        </View>
                        <View style= {{marginTop: 15, flexDirection: 'row'}}>
                            <Text style= {styles.normal_text}>Giới hạn độ tuổi: </Text>
                            <Text style= {styles.small_bold_text}>Thích thì xem, thanh tra đến thì chạy</Text>
                        </View>
                        <View style= {{marginTop: 15, flexDirection: 'row'}}>
                            <Text style= {styles.normal_text}>Ngôn ngữ: </Text>
                            <Text style= {styles.small_bold_text}>Nhìn là dc rồi ko cần hiểu</Text>
                        </View>
                    </View>

                    <View style={{marginTop: 20,width: '100%'}}>
                        <Text style={styles.bold_text}>Nội Dung</Text>
                        <Text style={styles.normal_text } numberOfLines = {lines}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Aenean placerat felis at diam hendrerit ornare. 
                            Vestibulum vel diam a justo ornare tristique non mollis ligula. 
                            Mauris feugiat diam urna, at sodales libero condimentum in. 
                            Integer egestas pretium purus ac aliquet. 
                            Donec fringilla eleifend tortor vitae luctus. 
                            Pellentesque dictum massa tincidunt lectus mattis tincidunt. 
                            Proin a dapibus diam. Nunc viverra, dolor ut ultricies eleifend, lacus sem posuere sapien, 
                            non malesuada metus arcu id erat. Vivamus vitae felis non nisi tristique semper. Nulla a leo id augue suscipit semper.
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean placerat felis at diam hendrerit ornare. Vestibulum vel diam a justo ornare tristique non mollis ligula. Mauris feugiat diam urna, at sodales libero condimentum in. Integer egestas pretium purus ac aliquet. Donec fringilla eleifend tortor vitae luctus. Pellentesque dictum massa tincidunt lectus mattis tincidunt. Proin a dapibus diam. Nunc viverra, dolor ut ultricies eleifend, lacus sem posuere sapien, non malesuada metus arcu id erat. Vivamus vitae felis non nisi tristique semper. Nulla a leo id augue suscipit semper.
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean placerat felis at diam hendrerit ornare. Vestibulum vel diam a justo ornare tristique non mollis ligula. Mauris feugiat diam urna, at sodales libero condimentum in. Integer egestas pretium purus ac aliquet. Donec fringilla eleifend tortor vitae luctus. Pellentesque dictum massa tincidunt lectus mattis tincidunt. Proin a dapibus diam. Nunc viverra, dolor ut ultricies eleifend, lacus sem posuere sapien, non malesuada metus arcu id erat. Vivamus vitae felis non nisi tristique semper. Nulla a leo id augue suscipit semper.
                        </Text>
                        <TouchableOpacity onPress={onTextPress}>
                            <Text style={styles.small_bold_text}>{lines === 3 ? 'Xem thêm' : 'Ẩn bớt'}</Text>
                        </TouchableOpacity>

                        <View style={{marginTop: 20,width: '100%'}}>
                            <Text style = {styles.bold_text}>Đạo diễn</Text>
                            <View style={{
                                marginTop: 10,
                                width: '50%',
                                height: 70,
                                backgroundColor: '#1c1c1c',
                                borderRadius: 12,
                                flexDirection: 'row',
                                alignItems: 'center',

                            }}>
                                <Image source={require('../../../src/assets/avatar.jpg')} 
                                style={{
                                    marginLeft: 15,
                                    width: 45,
                                    height: 45,
                                    borderRadius: 25,
                                }}/>
                                <View style ={{marginLeft: 10}}>
                                    <Text style={styles.normal_text}>Firstname</Text>
                                    <Text style={styles.normal_text}>Lastname</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop: 20,width: '100%'}}>
                            <Text style = {styles.bold_text}>Đạo diễn</Text>
                            <FlatList
                            horizontal
                            data={}
                            contentContainerStyle={{paddingRight: 20}}
                            renderItem={({item, index}) => (
                                <View style={{
                                    marginTop: 10,
                                    width: '50%',
                                    height: 70,
                                    backgroundColor: '#1c1c1c',
                                    borderRadius: 12,
                                    flexDirection: 'row',
                                    alignItems: 'center',
    
                                }}>
                                    <Image source={require('../../../src/assets/avatar.jpg')} 
                                    style={{
                                        marginLeft: 15,
                                        width: 45,
                                        height: 45,
                                        borderRadius: 25,
                                    }}/>
                                    <View style ={{marginLeft: 10}}>
                                        <Text style={styles.normal_text}>Firstname</Text>
                                        <Text style={styles.normal_text}>Lastname</Text>
                                    </View>
                                </View>
                            )}>

                            </FlatList>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cover: {
        width: '100%',
        height: 241,
    },
    main_frame:{
        top: -60,
        width: '92%',
        marginHorizontal: '4%',
    },
    general_info:{
        width: '100%',
        height: 200,
        backgroundColor: '#1c1c1c',
        borderRadius: 16,

    },
    bold_text:{
        fontSize: 22, 
        fontWeight: '700', 
        color: '#fff'
    },
    normal_text:{
        color: '#fff',
    },
    small_bold_text:{
        fontSize: 14, 
        fontWeight: '600', 
        color: '#fff'
    }
});

export default MovieDetails;

