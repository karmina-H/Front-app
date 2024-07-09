import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import LikeListScreen from './screens/LikeListScreen';
import { LikeFoodsProvider } from './context/LikeFoodsContext';
import MapapiScreen from './screens/MapapiScreen';
import FamouseListScreen from './screens/FamouseListScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <LikeFoodsProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="LikeList" component={LikeListScreen} />
            <Stack.Screen name="MapApi" component={MapapiScreen} />
            <Stack.Screen name="FamousList" component={FamouseListScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </LikeFoodsProvider>
  );
}
