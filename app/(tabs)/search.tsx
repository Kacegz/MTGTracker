import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // pakiet ikon

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2; // dwie karty w rzędzie

export default function CardGridScreen() {
  const cards = Array.from({ length: 20 }, (_, index) => ({
    id: index.toString(),
    title: 'Card template',
  }));

  return (
    <View style={styles.container}>

      {/* Górna belka z logo i wyszukiwarką */}
      <View style={styles.header}>
        <Ionicons name="dice-outline" size={32} color="white" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#999"
        />
      </View>

      {/* Nawigacja: Previous | Filter | Next */}
      <View style={styles.navBar}>
        <Pressable style={styles.navButton}>
          <Text style={styles.navButtonText}>Previous</Text>
        </Pressable>
        <Pressable style={styles.navButton}>
          <Ionicons name="filter-outline" size={20} color="white" />
          <Text style={styles.navButtonText}>Filter</Text>
        </Pressable>
        <Pressable style={styles.navButton}>
          <Text style={styles.navButtonText}>Next</Text>
        </Pressable>
      </View>

      {/* Lista kart */}
      <FlatList
        data={cards}
        numColumns={2}
        contentContainerStyle={styles.cardsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.title}</Text>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#222',
    borderRadius: 8,
    marginLeft: 8,
    flex: 1,
    paddingHorizontal: 12,
    height: 40,
    color: 'white',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navButtonText: {
    color: 'white',
    marginLeft: 4,
  },
  cardsList: {
    gap: 8,
  },
  card: {
    width: CARD_WIDTH,
    aspectRatio: 0.7,
    backgroundColor: '#666',
    borderRadius: 8,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: 'white',
  },
});
