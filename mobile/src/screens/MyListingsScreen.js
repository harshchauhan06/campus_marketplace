import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export default function MyListingsScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchMyListings();
    }, [])
  );

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get('http://192.168.1.6:5000/api/listings/my-listings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching my listings:', error);
      Alert.alert('Error', 'Failed to load your listings');
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
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={[styles.statusTag, item.status === 'SOLD' && styles.statusSold]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.price}>₹{item.price}</Text>
      <Text style={styles.details}>{item.category} • {item.condition}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {listings.length === 0 ? (
        <Text style={styles.emptyText}>You haven't posted any listings yet.</Text>
      ) : (
        <FlatList
          data={listings}
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
  list: { padding: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1 },
  statusTag: { backgroundColor: '#007AFF', color: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 10, fontWeight: 'bold', overflow: 'hidden' },
  statusSold: { backgroundColor: '#dc3545' },
  price: { fontSize: 16, color: '#28a745', marginVertical: 5, fontWeight: '600' },
  details: { fontSize: 14, color: '#666', marginBottom: 5 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#666', fontSize: 16 }
});
