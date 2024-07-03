import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Modal, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { FlatGrid } from 'react-native-super-grid';
import { LikeFoodsContext } from '../context/LikeFoodsContext';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const LikeListScreen = ({ navigation }) => {
    const { likeFoods, setLikeFoods } = useContext(LikeFoodsContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [fabbutton, setFabbutton] = useState(false);

    const navigation_to = useNavigation();

    const openModal = (image) => {
        setSelectedImage(image);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
    };

    const deleteItem = (name) => {
        Alert.alert(
            "삭제 확인",
            "정말로 이 항목을 삭제하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                {
                    text: "삭제",
                    onPress: () => {
                        setLikeFoods(prevFoods => prevFoods.filter(item => item.name !== name));
                    },
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.Top}>
                <View style={styles.Toptext}>
                    <Text style={styles.title}>좋아요 목록</Text>
                </View>
                <View style={styles.Topbutton}>
                    <Button mode="text" icon="arrow-left-circle" onPress={() => navigation.goBack()}>돌아가기</Button>
                </View>
            </View>
            <View style={styles.main}>
                {likeFoods !== null && likeFoods.length > 0 ? 
                <FlatGrid
                    itemDimension={130}
                    data={likeFoods}
                    style={styles.gridView}
                    spacing={10}
                    keyExtractor={(item) => item.name} // 아이템의 이름을 키로 사용
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            key={item.name} // 키로 이름 사용
                            onPress={() => openModal(`http://192.168.0.6:5000/${item.image}`)}
                            onLongPress={() => deleteItem(item.name)}
                            rippleColor="rgba(0, 0, 0, .32)"
                            style={styles.touchable}
                        >
                            <View style={styles.itemContainer}>
                                <Image source={{ uri: `http://192.168.0.6:5000/${item.image}` }} style={styles.image} />
                                <Text style={styles.text}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                /> : <View><Text>좋아요한 항목이 없습니다.</Text></View>
                }
            </View>

            {selectedImage && (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.modalBackground} onPress={closeModal}>
                            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}
            <Button icon="map-marker" mode="contained" onPress={() => navigation_to.navigate('MapApi')} style={styles.locationStyle}>
                    위치찾기
            </Button>
        </View>

    );
};

// const fabStyle = { [animateFrom]: 16 };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: width,
    },
    touchable: {
        borderRadius: 10,
    },
    Toptext: {
        flex: 1,
        marginLeft: 15,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    Topbutton: {
        flex: 1,
        alignItems: 'flex-end',
    },
    Top: {
        flex: 1,
        width: width,
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderBottomWidth: 1,
    },
    main: {
        flex: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
    },
    gridView: {
        flex: 1,
    },
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        height: 150,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: width,
        height: width,
        borderRadius: width / 2,
    },

    locationStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute',
        justifyContent: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
   
      },
});

export default LikeListScreen;
