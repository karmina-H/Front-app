import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {


    const [dislikeFoods, setDislikeFoods] = useState([]);
    const [likeFoods, setLikeFoods] = useState([]);

    const [swipeDirection, setSwipeDirection] = useState(null);
    // const [dislikeFoods, setdislikeFoods] = useState([]);
    // const [likeFoods, setlikeFoods] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [data, setData] = useState([]);
    const swiperRef = useRef(null);
    const navigation = useNavigation();

    const [swiperKey, setSwiperKey] = useState(0);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://192.168.0.6:5000/data'); // 로컬 서버 주소로 변경
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to fetch data. Please check your network and server.');
            }
    
        };
        fetchData();
    }, []);

    const handleSwiped = (cardIndex, direction) => {
        console.log("data length", data.length)
        console.log("current id:" , cardIndex+1);
        setTimeout(() => {
            setSwipeDirection(null);
        }, 300);
        console.log(`Card index: ${cardIndex}, Direction: ${direction}`);
        if (direction === 'right') {
            setLikeFoods([...likeFoods, cardIndex+1]);
        } else if (direction === 'left') {
            setDislikeFoods([...dislikeFoods, cardIndex+1]);
        }
        setCurrentIndex(cardIndex + 1); // 다음 카드 인덱스로 업데이트
        console.log("like:",likeFoods);
        console.log("dislike:", dislikeFoods);

        const newIndex = cardIndex + 1;

        if (newIndex === data.length) {
            Alert.alert(
                '모든 사진을 읽었습니다',
                '결과를 보시겠습니까?',
                [
                    {
                        text: '아니요(지금까지 정보가 모두 초기화 됩니다)',
                        onPress: () => {
                            setCurrentIndex(0);
                            props.setLikeFoods([]);
                            props.setDislikeFoods([]);
                            setSwiperKey(swiperKey + 1);

                        },
                        style: 'cancel',
                    },
                    { text: '예', onPress: () => navigation.navigate('Result') },
                ],
                { cancelable: false }
            );
        }
    };

    const handleSwiping = (x, y) => {
        if (Math.abs(x) > Math.abs(y)) {
            setSwipeDirection(x > 0 ? 'right' : 'left');
        }
    };

    const renderIcon = () => {
        if (swipeDirection === 'right') {
            return <Icon name="thumbs-up" size={50} color="green" style={styles.icon} />;
        } else if (swipeDirection === 'left') {
            return <Icon name="thumbs-down" size={50} color="red" style={styles.icon} />;
        }
        return null;
    };

    if (data.length === 0) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        
        <View style={styles.container}>
            <View style={styles.top}>
                <View style={styles.textwithicon}>
                    <MaterialCommunityIcons name="rice" size={40} color="black" />
                    <Text style={styles.toptext}>저메추 </Text>
                </View>
                <View>
                    <Button mode="elevated" onPress={() => console.log('Pressed')} >
                        <Text style={styles.topbuttontext}>좋아요목록 </Text>
                    </Button> 
                </View>
            </View>
            <View style={styles.swiperContainer}>
                <Swiper
                ref={swiperRef}
                key={swiperKey} //스와이퍼 재랜더링해서 처음그림부터 다시 보여주게하는 요소
                cards={data}
                cardIndex={currentIndex}
                renderCard={(card) => (
                    <View style={styles.card}>
                        <Image source={{ uri: `http://192.168.0.6:5000${card.uri}` }} style={styles.photo} />
                    </View>
                )}
                onSwipedLeft={(cardIndex) => handleSwiped(cardIndex, 'left')}
                onSwipedRight={(cardIndex) => handleSwiped(cardIndex, 'right')}
                onSwiping={(x, y) => handleSwiping(x, y)}
                backgroundColor={'transparent'}
                showSecondCard={true}
                stackSize={3}
                onSwipedAborted={() => setSwipeDirection(null)}
                verticalSwipe={false}
                infinite
                />
            {renderIcon()}
            </View>
            <View style={styles.bottom_text}>
                    <Text style={styles.cardName}>
                        {data[currentIndex]?.name}
                    </Text>
            </View>
            <View style={styles.bottom}>
                <Button icon = "reload" mode="text" onPress={() => console.log('Pressed')} style={styles.resetButton}>
                    <Text>
                        리셋
                    </Text>
                </Button>
                <Button mode="contained" onPress={() => console.log('Pressed')} style={styles.likelistbutton}>
                    <Text>
                        이거선택!
                    </Text>
                </Button>
                <Button mode="text" onPress={() => console.log('Pressed')} style={styles.dontknowbutton}>
                    <Text >
                        잘 모르겠어요
                    </Text>
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // borderColor: 'red',
        // borderStyle: 'solid',
        // borderWidth: 1, // 추가
        backgroundColor: '#cccccc',
    },
    top:{
        flex: 0.18,
        backgroundColor: '#cccccc',
        width: width,
        height: height*0.1,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 30,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        // borderColor: 'blue',
        // borderStyle: 'solid',
        // borderWidth: 1, // 추가
        flexDirection: 'row',
    },
    textwithicon:{
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor: 'blue',
        // borderStyle: 'solid',
        // borderWidth: 1, // 추가
    },
    toptext:{
        fontSize: 32,
        color: 'black',
        // borderColor: 'blue',
        // borderStyle: 'solid',
        // borderWidth: 1, // 추가
    },
    topbuttontext:{
        fontSize: 13,
        color: 'black',
        // borderColor: 'blue',
        // borderStyle: 'solid',
        // borderWidth: 1, // 추가
    },
    swiperContainer: {
        flex: 1, // swiperContainer가 남은 공간을 모두 차지하도록
        justifyContent: 'center', // 수직 가운데 정렬
        alignItems: 'center', // 수평 가운데 정렬
        width: width,
        // borderColor: 'red',
        // borderStyle: 'solid',
        // borderWidth: 1, // 추가
        backgroundColor: '#cccccc',
    },
    card: {
        width: width*0.9,// 카드의 너비
        height: height*0.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover',
    },
    bottom_text:{
        flex: 0.13,
        // borderColor: 'red',
        // borderStyle: 'solid',
        // borderWidth: 1, // 추가
        marginBottom: 30,
    },
    cardName: {
        fontSize: 30,
        color: 'black',
        textAlign: 'center',
    },
    bottom: {
        flex: 0.2,
        width: width*0.9,
        marginBottom: 30,
        // borderColor: 'red',
        // borderStyle: 'solid',
        // borderWidth: 1, 
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    resetButton: {
        flex: 1,
        alignItems: 'center',
        // borderColor: 'red',
        // borderStyle: 'solid',
        // borderWidth: 1, 
    },
    likelistbutton: {
        flex: 0.7,
        height: 90,
        alignItems: 'center',
        // borderColor: 'red',
        // borderStyle: 'solid',
        // borderWidth: 1, 
        justifyContent: 'center',
        borderRadius: 40,

    },
    dontknowbutton: {
        flex: 1,
        alignItems: 'center',
        // borderColor: 'red',
        // borderStyle: 'solid',
        // borderWidth: 1, 


    },
    icon: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -25,
        marginTop: -25,
    },
});

export default HomeScreen;
