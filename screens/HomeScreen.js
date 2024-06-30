import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Button, Badge } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LikeFoodsContext } from '../context/LikeFoodsContext';

const { width, height } = Dimensions.get('window');

const API_BASE_URL = 'http://192.168.0.6:5000'; //서버주소

const HomeScreen = () => {
    const [dislikeFoods, setDislikeFoods] = useState([]); //싫어하는 음식리스트 
    const { likeFoods, setLikeFoods } = useContext(LikeFoodsContext); //좋아하는 음식리스트전역변수
    const [dontknowFoods, setDontknowFoods] = useState([]); //잘 모르겠는 음식리스트전역변수
    const [swipeDirection, setSwipeDirection] = useState(null); //스와이프 방향
    const [currentIndex, setCurrentIndex] = useState(0); //현재 인덱스
    const [dontKnowPressed, setDontKnowPressed] = useState(false); //잘 모르겠어요 버튼 눌렀는지
    const [data, setData] = useState([]); //서버로부터 받아온 음식 json데이터
    const swiperRef = useRef(null); //swiper 레퍼런스
    const navigation = useNavigation();
    const [swiperKey, setSwiperKey] = useState(0); //siwper를 재 랜더링하기 위한 key
    const [stackcount, setStackcount] = useState(3); //스택카운트

    const [feedbackindex, setFeedbackIndex] = useState(0); //피드백 인덱스 지금 몇번째로 서버에서 랜더중인지 

    const[cardview, setCardview] = useState(true); //카드뷰


 


    const fetch_data = useCallback(async (index) => { //성능 최적화를 위해 useCallback 사용
        try{
            let data_len = 0;
            console.log('index:', index);
            if (index === 0) { //인덱스가 0일경우 무작위 데이터 가져옴
                    console.log('fecth1');
                    if(currentIndex !== 0){
                        setCurrentIndex(0);
                    }
                    setFeedbackIndex(0);
                    let url = `${API_BASE_URL}/data`;
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.json();
                    setData(result[0]) // 첫 번째 요소가 메뉴 데이터
                    data_len = result[1]; // 두 번째 요소가 데이터 길이
            }else{ //인덱스가 1,2,3일경우 각각 피드백된 데이터 3개,4개,5개 가져옴
                console.log('fecth2');
                    let url = `${API_BASE_URL}/recommendation${Math.min(index, 3)}`; //피드백된 데이터 가져오는 url
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            likeFoods: likeFoods,
                            dislikeFoods: dislikeFoods,
                        }),
                    });
        
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.json();
                    setData(result[0]) // 첫 번째 요소가 메뉴 데이터
                    data_len = result[1]; // 두 번째 요소가 데이터 길이
                    Alert.alert('Success', 'Data successfully sent to server');
                    setCurrentIndex(0);
            }
            console.log('data_len:', data_len);
            if(data_len == 0){
                Alert.alert(
                    '더이상 추천할 음식이 없습니다. 처음부터 다시 시작하시겠습니까?',
                    'Would you like to start over?',
                    [
                        {
                            text: '아니요',
                            onPress: () => setCardview(false),
                            style: 'cancel',
                        },
                        {
                            text: '예',
                            onPress: async() => {
                                await fetch_data(0); // fetchData가 완료될 때까지 기다립니다.
                                setCurrentIndex(0);
                                setLikeFoods([]);
                                setDislikeFoods([]);
                                setDontknowFoods([]);
                                setSwiperKey(swiperKey - 50);
                                resetExcludeIndices();
                            },
                        },
                    ],
                    { cancelable: false }
                );
            }

        } catch (error) { //데이터 받아오는데 실패했을때 에러처리
            console.error('Error sending data:', error);
            Alert.alert('Error', 'Failed to send data to server');
        }

    }, []);

    useEffect(() => { // 데이터가 변경될 때마다 로그 출력
        if (data.length > 0) {
            for (let i = 0; i < Math.min(data.length, 5); i++) { // 받은 데이터 확인용 콘솔로그
                console.log(data[i].name);
            }
        }
    }, [data]);
    

    useEffect(() => { //컴포넌트가 처음 렌더링 될때 무작위 데이터 가져오는 함수
        fetch_data(0);
    }, []);
 

    useEffect(() => { //현재 인덱스가 변경될때 마다 실행되는데 현재 인덱스가 5가 되면 추천메뉴 받아옴
        const tempfunc = async () => {

        if (currentIndex === 5) {
            setCurrentIndex(0);
            if(likeFoods.length == 0){ //만약 좋아요 리스트가 비어있으면(삭제한경우가 있을 수 있으니까) 처음부터 다시시작
                await fetch_data(0);
                setFeedbackIndex(0);
                setStackcount(3); //5번째 카드일때 그다음 카드가 랜더링 된 뒤에 3개만 보이게
            }else{
                await fetch_data(feedbackindex + 1);
                setFeedbackIndex(prevIndex => prevIndex + 1);
                setStackcount(3) //5번째 카드일때 그다음 카드가 랜더링 된 뒤에 3개만 보이게
            }
        }else if(currentIndex === 4){
            setStackcount(1) //4번째 카드일때 뒤에 1개만 보이게
        }else if(currentIndex === 3){
            setStackcount(2)//3번째 카드일때 뒤에 2개만 보이게
        }else{
            setStackcount(3)//나머지는 3개 보이게
        }

        if(dontKnowPressed && (currentIndex !== 5)){ //잘 모르겠어요 버튼 눌렀을때 카드 컴포넌트가 다시 렌더링 되게
            setSwiperKey(swiperKey + 1);
        }

        
    }
    tempfunc();
    console.log('currentIndex1:', currentIndex);

    }, [currentIndex]);


    const handleSwiped = (cardIndex, direction) => { //카드를 스와이프 했을때 실행되는 함수
        if (direction === 'right') {
            setLikeFoods(prev => [...prev, data[cardIndex]]);
            setTimeout(() => { 
                setSwipeDirection(false);
            }, 400);
        } else if (direction === 'left') {
            setDislikeFoods(prev => [...prev, data[cardIndex]]);
            setTimeout(() => { 
                setSwipeDirection(false);
            }, 400);
        }
        setCurrentIndex(prevIndex => prevIndex + 1);
    };

    const handleSwiping = (x, y) => { //카드를 스와이프 하는중일때 실행되는 함수(아이콘 랜더링용)
        if (Math.abs(x) > Math.abs(y)) {
            setSwipeDirection(x > 0 ? 'right' : 'left');
        }
    };
        

    const handleDontknow = () => { //잘 모르겠어요 버튼 눌렀을때 실행되는 함수
        setDontKnowPressed(true);
        
        setTimeout(() => { 
            setDontKnowPressed(false);
        }, 500);
        setDontknowFoods(prev => [...prev, data[currentIndex]]);
        setCurrentIndex(prevIndex => prevIndex + 1);

    }

    const handleSelect = () => { //이거선택 버튼 눌렀을때 실행되는 함수
        const currentname = data[currentIndex]?.name;
        const sstr = `${currentname} 을(를)선택하시겠습니까?`;
        Alert.alert(
            '최종선택 확인',
            sstr,
            [
                { 
                    text: '아니요',
                    onPress: () => console.log('취소됨'), 
                    style: 'cancel',
                },
                {
                    text: '예',
                    onPress: async() => { //예를 눌렀을때 모든것이 초기화 되고 다시 처음부터 시작
                        await fetch_data(0); // fetchData가 완료될 때까지 기다립니다.
                        setCurrentIndex(0);
                        setLikeFoods([]);
                        setDislikeFoods([]);
                        setDontknowFoods([]);
                        setSwiperKey(swiperKey - 50);
                        resetExcludeIndices();
                    },
                },
            ],
            { cancelable: false }
        );
    }

    const handleReset = () => { //리셋버튼 눌렀을때 실행되는 함수
        Alert.alert(
            '초기화 확인',
            '지금까지 정보들 모두 초기화 하시겠습니까?',
            [
                {
                    text: '아니요',
                    onPress: () => console.log('취소됨'),
                    style: 'cancel',
                },
                {
                    text: '예',
                    onPress: async() => { //예를 눌렀을때 모든것이 초기화 되고 다시 처음부터 시작
                        await fetch_data(0);
                        setCardview(true); 
                        setCurrentIndex(0);
                        setLikeFoods([]);
                        setDislikeFoods([]);
                        setDontknowFoods([]);
                        setSwiperKey(swiperKey - 50);
                        resetExcludeIndices();
                    },
                },
            ],
            { cancelable: false }
        );
    }

    const resetExcludeIndices = async () => {//서버에 exclude indices 초기화 요청(reset버튼 눌렀을때 서버에 있는 exclude indices 초기화하기 위한 함수)
        try {
            let url = `${API_BASE_URL}/excludedListInit`;
            const response = await fetch(url, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to reset exclude indices');
            }
            Alert.alert('Success', 'Exclude indices have been reset');
        } catch (error) {
            console.error('Error resetting exclude indices:', error);
            Alert.alert('Error', `Failed to reset exclude indices: ${error.message}`);
        }
    };

    const handleLikeList = () => { //좋아요목록 버튼 눌렀을때 좋아요목록 화면으로 이동
        navigation.navigate('LikeList');
    }

    const renderIcon = () => { //스와이프 방향에 따라 아이콘 랜더링
        if (swipeDirection === 'right') {
            return <Icon name="thumbs-up" size={50} color="green" style={styles.icon} />;
        } else if (swipeDirection === 'left') {
            return <Icon name="thumbs-down" size={50} color="red" style={styles.icon} />;
        } else if (dontKnowPressed) {
            return <Icon name="question" size={50} color="blue" style={styles.icon} />;
        }
        return null;
    };

    if (data.length === 0) { //데이터가 없을때 로딩화면
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
                    <MaterialCommunityIcons name="rice" size={40} color="white" />
                    <Text style={styles.toptext}>저메추 </Text>
                </View>
                <View>
                    <Button mode="elevated" onPress={handleLikeList}>
                        <Text style={styles.topbuttontext}>좋아요목록</Text>
                        {likeFoods.length!==0 && <Badge>{likeFoods.length}</Badge>}
                    </Button>
                </View>
            </View>
            <View style={styles.swiperContainer}>
            {cardview&&<Swiper
                    ref={swiperRef}
                    key={swiperKey}
                    cards={data}
                    cardIndex={currentIndex}
                    renderCard={(card) => (
                        <View style={styles.card}>
                            <Image source={{ uri: `${API_BASE_URL}/${card.image}` }} style={styles.photo} />
                        </View>
                    )}
                    onSwipedLeft={(cardIndex) => handleSwiped(cardIndex, 'left')}
                    onSwipedRight={(cardIndex) => handleSwiped(cardIndex, 'right')}
                    onSwiping={(x, y) => handleSwiping(x, y)}
                    backgroundColor={'transparent'}
                    showSecondCard={true}
                    stackSize={stackcount}
                    onSwipedAborted={() => setSwipeDirection(null)}
                    verticalSwipe={false}
                    infinite
                />}
                {renderIcon()}
            </View>
            <View style={styles.bottom_text}>
                <Text style={styles.cardName}>
                    {data[currentIndex]?.name} 
                </Text>
            </View>
            <View style={styles.bottom}>
                <Button icon="reload" mode="text" onPress={handleReset} style={styles.resetButton}>
                    <Text>리셋</Text>
                </Button>
                <Button mode="contained" onPress={() => handleSelect(currentIndex)} style={styles.likelistbutton}>
                    <Text>이거선택!</Text>
                </Button>
                <Button mode="text" onPress={() => handleDontknow()} style={styles.dontknowbutton}>
                    <Text>잘 모르겠어요</Text>
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
        backgroundColor: 'black',
    },
    top: {
        flex: 0.18,
        backgroundColor: 'black',
        width: width,
        height: height * 0.1,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 30,
        borderBottomWidth: 1,
        borderColor: 'white',
        flexDirection: 'row',
    },
    textwithicon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toptext: {
        fontSize: 32,
        color: 'white',
    },
    topbuttontext: {
        fontSize: 13,
        color: 'black',
    },
    swiperContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        backgroundColor: 'black',
    },
    card: {
        width: width * 0.9,
        height: height * 0.5,
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
    bottom_text: {
        flex: 0.13,
        marginBottom: 30,
    },
    cardName: {
        fontSize: 30,
        color: 'white',
        textAlign: 'center',
    },
    bottom: {
        flex: 0.2,
        width: width * 0.9,
        marginBottom: 30,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    resetButton: {
        flex: 1,
        alignItems: 'center',
    },
    likelistbutton: {
        flex: 0.7,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
    },
    dontknowbutton: {
        flex: 1,
        alignItems: 'center',
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
