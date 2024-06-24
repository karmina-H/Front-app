import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useState } from 'react';

// import HomeScreen from './HomeScreen';
// import ResultScreen from './ResultScreen';
// import ProfileScreen from './ProfileScreen';

import HomeScreen from '../screens/HomeScreen';
import ResultScreen from '../screens/ResultScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {


    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    if (route.name === 'Home') {
                        return <Ionicons name="restaurant" size={size} color={color} />;
                    } else if (route.name === 'Result') {
                        return <MaterialIcons name="recommend" size={size} color={color} />;
                    } else if (route.name === 'Profile') {
                        return <Ionicons name="person" size={size} color={color} />;
                    }
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
                tabBarKeyBoardHidesTabBar: true,
                headerShown: false,
                tabBarStyle: [
                    {
                        display: 'flex',
                    },
                    null,
                ],
            })}
        >
            <Tab.Screen 
                name="Home" 
                options={{
                    headerShown: true,
                    headerTitle: '저녁 뭐 먹지?',
                    headerLeft: () => (
                        <FontAwesome6
                            name="bowl-food"
                            size={24}
                            color="black"
                            style={{ marginLeft: 10 }}
                        />
                    ),
                }}
            >
                {props => (
                    <HomeScreen
                        {...props}
                    />
                )}
            </Tab.Screen>
            <Tab.Screen 
                name="Result"
            >
                {props => (
                    <ResultScreen
                        {...props}
                        dislikeFoods={dislikeFoods}
                        likeFoods={likeFoods}
                    />
                )}
            </Tab.Screen>
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
