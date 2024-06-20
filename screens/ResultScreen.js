import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResultScreen = ( props) => {
  const { likeFoods, dislikeFoods } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Liked Foods</Text>
      {likeFoods.map((food, index) => (
        <Text key={index} style={styles.foodItem}>{food}</Text>
      ))}
      <Text style={styles.header}>Disliked Foods</Text>
      {dislikeFoods.map((food, index) => (
        <Text key={index} style={styles.foodItem}>{food}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  foodItem: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default ResultScreen;
