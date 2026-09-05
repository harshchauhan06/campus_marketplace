import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const CATEGORIES = ['All', 'Books', 'Electronics', 'Vehicles', 'Hostel Items', 'Gaming'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low-High', value: 'price_asc' },
  { label: 'Price: High-Low', value: 'price_desc' }
];

export default function HomeScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOption, setSortOption] = useState('newest');

  useFocusEffect(
    useCallback(() => {
      fetchListings();
    }, [searchQuery, activeCategory, sortOption]) // Re-fetch when search, category, or sort changes
  );

  const fetchListings = async () => {
    try {
      setLoading(true);
      let url = `http://192.168.1.6:5000/api/listings?`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
      if (activeCategory !== 'All') url += `category=${encodeURIComponent(activeCategory)}&`;
      if (sortOption !== 'newest') url += `sort=${encodeURIComponent(sortOption)}&`;

      const response = await axios.get(url);
      setListings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
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
      <Text style={styles.header}>Campus Marketplace</Text>
      
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search items, books, electronics..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={fetchListings}
        />
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.chip, activeCategory === cat && styles.activeChip]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.activeChipText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.sortContainer}>
          {SORT_OPTIONS.map(sort => (
            <TouchableOpacity 
              key={sort.value} 
              style={[styles.sortChip, sortOption === sort.value && styles.activeSortChip]}
              onPress={() => setSortOption(sort.value)}
            >
              <Text style={[styles.sortChipText, sortOption === sort.value && styles.activeSortChipText]}>{sort.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : listings.length === 0 ? (
        <Text style={styles.emptyText}>No listings found.</Text>
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
  searchContainer: { paddingHorizontal: 15, paddingTop: 15, backgroundColor: '#f9f9f9' },
  searchInput: { backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  
  filterSection: { paddingVertical: 10 },
  categoryScroll: { paddingHorizontal: 15, paddingBottom: 10 },
  chip: { backgroundColor: '#e9ecef', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  activeChip: { backgroundColor: '#007AFF' },
  chipText: { color: '#333', fontWeight: 'bold' },
  activeChipText: { color: '#fff' },
  
  sortContainer: { flexDirection: 'row', paddingHorizontal: 15, paddingBottom: 5 },
  sortChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, borderWidth: 1, borderColor: '#ddd', marginRight: 8, backgroundColor: '#fff' },
  activeSortChip: { borderColor: '#007AFF', backgroundColor: '#e6f2ff' },
  sortChipText: { fontSize: 12, color: '#555' },
  activeSortChipText: { color: '#007AFF', fontWeight: 'bold' },

  list: { padding: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 16, color: '#28a745', marginVertical: 5, fontWeight: '600' },
  details: { fontSize: 14, color: '#666', marginBottom: 5 },
  seller: { fontSize: 12, color: '#999', fontStyle: 'italic' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#666', fontSize: 16 }
});
