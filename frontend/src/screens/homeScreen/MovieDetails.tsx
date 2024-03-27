import { RowHorizontal } from 'iconsax-react-native';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { getMovieDetailsAPI } from '../../apis';



const MovieDetails = () => {
    const [movieDetails, setMovieDetails] = useState<any>(null);
    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await getMovieDetailsAPI('66010ef6d82009222e7c29dd');
                setMovieDetails(response.data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };

        fetchMovieDetails();
    }, []);
    
    // Date processing
    const rawDate = new Date(movieDetails?.data.movie.releaseDate);
    const releaseDate = `${rawDate.getDate().toString().padStart(2, '0')}/${(rawDate.getMonth() + 1).toString().padStart(2, '0')}/${rawDate.getFullYear().toString().slice(-2)}`;

    // Read more/less
    const [lines, setLines] = useState(3);
    const onTextPress = () => {
        setLines(lines === 3 ? 0 : 3); 
      };
    
    const genresArray = movieDetails?.data.movie.genres;
    const genresString = genresArray?.join(', ');
    return (
        <SafeAreaView style= {styles.container}>
            <ScrollView style={{}}>
                <Image style={styles.cover} source={{uri : movieDetails.data.movie.poster}}/>
                <View style={styles.main_frame}>
                    <View style={styles.general_info}>
                        <View style={{
                            marginTop: 38,
                            marginLeft: 30,
                            width: '80%',
                            height: 50,
                            alignItems: 'flex-start',
                        }}>
                            <Text style={styles.bold_text}>{movieDetails.data.movie.title}</Text>
                            <Text style={{fontSize: 12, fontWeight: '400', color: '#737373'}}>{movieDetails.data.movie.duration} Phút • releaseDate</Text>
                        </View>
                        <View style={{marginTop: 26}}>
                            <View style={{marginLeft:30, flexDirection: 'row', alignItems: 'flex-start'}}>
                                <Text style={styles.small_bold_text}>Review </Text>
                                <Text style={styles.small_bold_text}>{movieDetails.data.movie.rating}</Text>
                                <Text style={{fontSize: 12, fontWeight: '300', color: '#737373', marginLeft: 5}}>({movieDetails.data.movie.rating_count})</Text>
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
                            <Text style= {styles.small_bold_text}>{genresString}</Text>
                        </View>
                        <View style= {{marginTop: 15, flexDirection: 'row'}}>
                            <Text style= {styles.normal_text}>Giới hạn độ tuổi: </Text>
                            <Text style= {styles.small_bold_text}>{movieDetails.data.movie.cens}</Text>
                        </View>
                    </View>

                    <View style={{marginTop: 20,width: '100%'}}>
                        <Text style={styles.bold_text}>Nội Dung</Text>
                        <Text style={styles.normal_text } numberOfLines = {lines}>
                            {movieDetails.data.movie.description}
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
                                <Image source={{uri : movieDetails.data.movie.director.photo}} 
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
                            data={[1,2,3,4,5,6,7,8,9,10]}
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

