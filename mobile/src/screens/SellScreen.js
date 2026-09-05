import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function SellScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [condition, setCondition] = useState('Good');
  const [type, setType] = useState('SELL');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePostListing = async () => {
    if (!title || !price || !category || !type) {
      Alert.alert('Error', 'Please fill all required fields (Title, Price, Category, Type).');
      return;
    }

    setLoading(true);
    try {
      // 1. Grab the token we saved during login
      const token = await SecureStore.getItemAsync('userToken');
      
      if (!token) {
        Alert.alert('Error', 'You must be logged in to create a listing.');
        setLoading(false);
        return;
      }

      // 2. Call our protected backend endpoint
      await axios.post(
        'http://192.168.1.6:5000/api/listings',
        {
          title,
          description,
          price: parseFloat(price),
          category,
          condition,
          type,
          location
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Alert.alert('Success', 'Listing posted successfully!');
      
      // Clear form
      setTitle('');
      setDescription('');
      setPrice('');
      setLocation('');
      
      // Navigate to Home tab so user can see it
      navigation.navigate('HomeTab');
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || 'Failed to create listing';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.header}>Create a New Listing</Text>

      <Text style={styles.label}>Title *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g., iPhone 13 Pro" />

      <Text style={styles.label}>Price (₹) *</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="e.g., 50000" keyboardType="numeric" />

      <Text style={styles.label}>Category (Default: Electronics) *</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Books, Electronics, etc." />

      <Text style={styles.label}>Type (SELL, RENT, EXCHANGE) *</Text>
      <TextInput style={styles.input} value={type} onChangeText={setType} autoCapitalize="characters" />

      <Text style={styles.label}>Condition (Default: Good)</Text>
      <TextInput style={styles.input} value={condition} onChangeText={setCondition} placeholder="New, Good, Fair" />

      <Text style={styles.label}>Location / Hostel</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="e.g., Hostel A, Room 101" />

      <Text style={styles.label}>Description</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        value={description} 
        onChangeText={setDescription} 
        multiline 
        numberOfLines={4} 
        placeholder="Provide more details..." 
      />

      <TouchableOpacity style={styles.button} onPress={handlePostListing} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Post Listing</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 5 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
