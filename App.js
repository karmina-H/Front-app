import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import LikeListScreen from './screens/LikeListScreen';
import { LikeFoodsProvider } from './context/LikeFoodsContext';
const Stack = createStackNavigator();

export default function App() {
  return (
    <LikeFoodsProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="LikeList" component={LikeListScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </LikeFoodsProvider>
  );
}
