import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import ListingDetailsScreen from './src/screens/ListingDetailsScreen';
import MyListingsScreen from './src/screens/MyListingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={MainTabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ListingDetails" 
          component={ListingDetailsScreen} 
          options={{ title: 'Listing Details' }} 
        />
        <Stack.Screen 
          name="MyListings" 
          component={MyListingsScreen} 
          options={{ title: 'My Listings' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
