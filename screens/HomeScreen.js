import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
    const [likedFoods, setLikedFoods] = useState([]);
    const [dislikedFoods, setDislikedFoods] = useState([]);
    const [swipeDirection, setSwipeDirection] = useState(null);
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [data, setData] = useState([]);
    const swiperRef = useRef(null);

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

    if (data.length === 0) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Swiper
                ref={swiperRef}
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
                backgroundColor={'black'}
                showSecondCard={true}
                stackSize={10}
                onSwipedAborted={() => setSwipeDirection(null)}
                verticalSwipe={false}
                infinite
            />
            {renderIcon()}
            <Text style={styles.cardName}>
                {data[currentIndex % data.length]?.name}
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
        width: width * 0.9,
        height: height * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
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
        marginLeft: -25,
        marginTop: -25,
    },
    cardName: {
        position: 'absolute',
        fontSize: 20,
        color: 'yellow',
        marginTop: 10,
        textAlign: 'center',
        bottom: 70,
    },
});

export default HomeScreen;
