import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get('http://192.168.1.6:5000/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('ListingDetails', { id: item.id })}
      activeOpacity={0.7}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
      <Text style={styles.details}>{item.category} • {item.condition}</Text>
      <Text style={styles.seller}>Sold by: {item.seller_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Wishlist ❤️</Text>
      
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : favorites.length === 0 ? (
        <Text style={styles.emptyText}>You haven't saved any listings yet!</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', padding: 20, backgroundColor: '#fff', elevation: 2, color: '#333' },
  list: { padding: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 16, color: '#28a745', marginVertical: 5, fontWeight: '600' },
  details: { fontSize: 14, color: '#666', marginBottom: 5 },
  seller: { fontSize: 12, color: '#999', fontStyle: 'italic' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#666', fontSize: 16 }
});
