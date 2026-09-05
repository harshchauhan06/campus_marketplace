import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function ListingDetailsScreen({ route, navigation }) {
  // We grab the listing ID that was passed from the Home screen
  const { id } = route.params;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      const response = await axios.get(`http://192.168.1.6:5000/api/listings/${id}`);
      setListing(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listing details:', error);
      setLoading(false);
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
      
      <View style={styles.tagContainer}>
        <Text style={styles.typeTag}>{listing.type}</Text>
        <Text style={styles.categoryTag}>{listing.category}</Text>
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
  tagContainer: { flexDirection: 'row', marginBottom: 10 },
  typeTag: { backgroundColor: '#007AFF', color: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold', marginRight: 10 },
  categoryTag: { backgroundColor: '#e9ecef', color: '#333', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold' },
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
