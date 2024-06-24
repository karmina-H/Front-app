import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './navigation/MainTabNavigator';
import ProfileScreen from './screens/ProfileScreen';
import HomeScreen from './screens/HomeScreen';
import { PaperProvider } from 'react-native-paper';


export default function App() {
  return (
  <PaperProvider>
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
   </PaperProvider>
  );
}
