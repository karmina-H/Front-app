import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';

const data = [
  { id: '1', uri: require('../assets/pic1.png'), name: 'pic1'},
  { id: '2', uri: require('../assets/pic2.png'), name: 'pic2' },
  { id: '3', uri: require('../assets/pic3.png'), name: 'pic3' },
  { id: '4', uri: require('../assets/favicon.png'), name: 'pic4' },
  { id: '5', uri: require('../assets/adaptive-icon.png'), name: 'pic5' },
  {id: '6', uri: require('../assets/splash.png'), name: 'pic6' },
    // 필요한 만큼 추가
];

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
    const [likedFoods, setLikedFoods] = useState([]);
    const [dislikedFoods, setDislikedFoods] = useState([]);
    // const [favoriteFoods, setFavoriteFoods] = useState([]); 
    const [swipeDirection, setSwipeDirection] = useState(null);
    const swiperRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleSwiped = (cardIndex, direction) => {
        setTimeout(() => {
            setSwipeDirection(null);
        }, 300);
        console.log(`Card index: ${cardIndex}, Direction: ${direction}`);
        if (direction === 'right') {
            setLikedFoods([...likedFoods, data[cardIndex]]);
        } else if (direction === 'left') {
            setDislikedFoods([...dislikedFoods, data[cardIndex]]);
        }
        setCurrentIndex(cardIndex + 1); // 다음 카드 인덱스로 업데이트
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

    return (
        <View style={styles.container}>
            <Swiper
                ref={swiperRef}
                cards={data}
                cardIndex={0}
                renderCard={(card) => (
                    <View style={styles.card}>
                        <Image source={card.uri} style={styles.photo} />
                    </View>
                )}
                onSwipedLeft={(cardIndex) => handleSwiped(cardIndex, 'left')} //카드가 왼쪽으로 스와이프된 경우 호출되는 함수. 스와이프한 카드의 인덱스를 전달받음
                onSwipedRight={(cardIndex) => handleSwiped(cardIndex, 'right')} // 카드가 오른쪽으로 스와이프된 경우 호출되는 함수. 스와이프한 카드의 인덱스를 전달받음
                onSwiping={(x, y) => handleSwiping(x, y)} //카드가 이동 중일 때 호출되는 함수. X 및 Y 위치를 전달받음
                backgroundColor={'black'} // 카드 뒷면의 배경색
                showSecondCard={true} // 두 번째 카드를 보여줄지 여부
                stackSize={5} // 동시에 보여지는 카드 수
                onSwipedAborted={() => setSwipeDirection(null)} // 스와이프가 중단된 경우 아이콘 바로삭제
                verticalSwipe={false} // 수직 스와이프 비활성화
                infinite
            />
            {renderIcon()}
            <Text style={styles.cardName}>
                {data[currentIndex % data.length].name} 
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: width *0.9,
        height: height * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.8,
        // shadowRadius: 5,
        backgroundColor: '#fff',
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover',
    },
    icon: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -25, // 반지름 절반 만큼 왼쪽으로 이동
        marginTop: -25,  // 반지름 절반 만큼 위로 이동
    },
    cardName: {
        position: 'absolute',
        fontSize: 20,
        color: 'yellow',
        marginTop: 10,
        textAlign: 'center',
        bottom: 70
    },
});

export default HomeScreen;




