import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import SellScreen from '../screens/SellScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // We can enable this later if we want header bars
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Home' }} 
      />
      <Tab.Screen 
        name="SellTab" 
        component={SellScreen} 
        options={{ tabBarLabel: 'Sell' }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profile' }} 
      />
    </Tab.Navigator>
  );
}
