import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function ProfileScreen({ navigation }) {
  const handleLogout = async () => {
    // Clear the SecureStore token
    await SecureStore.deleteItemAsync('userToken');
    // Navigate back to Login
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => navigation.navigate('MyListings')}
      >
        <Text style={styles.actionButtonText}>My Listings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
  text: { fontSize: 20, fontWeight: 'bold', marginBottom: 40 },
  actionButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, width: 200, alignItems: 'center', marginBottom: 20 },
  actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  button: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 10, width: 200, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
