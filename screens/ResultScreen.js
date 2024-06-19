import React from 'react';
import { View, Text, Button } from 'react-native';
import { StyleSheet } from 'react-native';

const ResultScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});



export default ResultScreen;