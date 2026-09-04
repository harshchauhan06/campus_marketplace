import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function HomeScreen() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      // Fetching from our public listings endpoint
      const response = await axios.get('http://192.168.1.6:5000/api/listings');
      setListings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
      <Text style={styles.details}>{item.category} • {item.condition}</Text>
      <Text style={styles.seller}>Sold by: {item.seller_name}</Text>
    </View>
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
      <Text style={styles.header}>Campus Marketplace</Text>
      {listings.length === 0 ? (
        <Text style={styles.emptyText}>No listings found. Be the first to sell!</Text>
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
  header: { fontSize: 22, fontWeight: 'bold', padding: 20, backgroundColor: '#fff', elevation: 2 },
  list: { padding: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 16, color: '#28a745', marginVertical: 5, fontWeight: '600' },
  details: { fontSize: 14, color: '#666', marginBottom: 5 },
  seller: { fontSize: 12, color: '#999', fontStyle: 'italic' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#666', fontSize: 16 }
});
