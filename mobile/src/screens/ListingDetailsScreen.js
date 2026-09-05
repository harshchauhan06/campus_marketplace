import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export default function ListingDetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchListingDetails();
    checkFavoriteStatus();
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      const response = await axios.get(`http://192.168.1.6:5000/api/listings/${id}`);
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) return;
      const response = await axios.get(`http://192.168.1.6:5000/api/favorites/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        Alert.alert('Login Required', 'You need to be logged in to save listings.');
        return;
      }
      const response = await axios.post(`http://192.168.1.6:5000/api/favorites/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Could not update favorites');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.centered}>
        <Text>Listing not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      
      <View style={styles.headerRow}>
        <View style={styles.tagContainer}>
          <Text style={styles.typeTag}>{listing.type}</Text>
          <Text style={styles.categoryTag}>{listing.category}</Text>
        </View>

        <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
          <Text style={styles.favoriteText}>{isFavorite ? '❤️ Saved' : '🤍 Save'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{listing.title}</Text>
      <Text style={styles.price}>₹{listing.price}</Text>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{listing.description || 'No description provided.'}</Text>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Details</Text>
      <Text style={styles.detailText}>Condition: <Text style={styles.bold}>{listing.condition}</Text></Text>
      <Text style={styles.detailText}>Location: <Text style={styles.bold}>{listing.location || 'Not specified'}</Text></Text>
      <Text style={styles.detailText}>Posted on: <Text style={styles.bold}>{new Date(listing.created_at).toLocaleDateString()}</Text></Text>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Seller Information</Text>
      <Text style={styles.detailText}>Name: <Text style={styles.bold}>{listing.seller_name}</Text> {listing.is_verified ? '✓' : ''}</Text>
      
      {/* We'll implement Contact Seller / Chat in a future phase */}
      <TouchableOpacity style={styles.contactButton} onPress={() => alert('Chat feature coming soon!')}>
        <Text style={styles.contactButtonText}>Contact Seller</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tagContainer: { flexDirection: 'row' },
  typeTag: { backgroundColor: '#007AFF', color: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold', marginRight: 10 },
  categoryTag: { backgroundColor: '#e9ecef', color: '#333', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold' },
  favoriteButton: { padding: 8, backgroundColor: '#f1f1f1', borderRadius: 20 },
  favoriteText: { fontSize: 14, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#28a745', marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  description: { fontSize: 15, color: '#555', lineHeight: 22 },
  detailText: { fontSize: 15, color: '#444', marginBottom: 8 },
  bold: { fontWeight: '600', color: '#111' },
  contactButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  contactButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
