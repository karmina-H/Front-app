import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';

const cards = [
  { text: 'Card 1', key: '1' },
  { text: 'Card 2', key: '2' },
  { text: 'Card 3', key: '3' },
];

const ProfileScreen = () => {
  const [lastTap, setLastTap] = useState(null);

  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      Alert.alert('더블클릭 감지됨');
    } else {
      setLastTap(now);
    }
  }, [lastTap]);

  return (
    <View style={styles.container}>
      <Swiper
        cards={cards}
        renderCard={(card) => (
          <TouchableOpacity onPress={handleDoubleTap} style={styles.card}>
            <Text style={styles.text}>{card.text}</Text>
          </TouchableOpacity>
        )}
        onSwiped={(cardIndex) => { console.log(cardIndex); }}
        onSwipedAll={() => { console.log('All cards swiped'); }}
        cardIndex={0}
        backgroundColor={'#4FD0E9'}
        stackSize={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: Dimensions.get('window').width*0.4, // 카드의 너비
    height: Dimensions.get('window').height*0.4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  text: {
    fontSize: 24,
    color: '#333',
  },
});

export default ProfileScreen;
