import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // pakiet ikon
import { router, useLocalSearchParams } from 'expo-router';
import type { Card } from '../types/card';

// Calculate dimensions for the grid
const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 16;
const CARD_MARGIN = 8;
const GRID_COLUMNS = 2;

// Calculate card width based on screen size and grid parameters
const CARD_WIDTH = (SCREEN_WIDTH - (GRID_PADDING * 2) - (CARD_MARGIN * (GRID_COLUMNS * 2))) / GRID_COLUMNS;
// Use MTG card aspect ratio (63mm × 88mm)
const CARD_HEIGHT = CARD_WIDTH * (88 / 63);

export default function CardGridScreen() {
  const params = useLocalSearchParams<{ searchResults?: string }>();
  const [cards, setCards] = useState<Card[]>(() => {
    if (params.searchResults) {
      return JSON.parse(params.searchResults);
    }
    return [];
  });

  const getCardImage = (card: Card): string => {
    if (card.image_uris?.border_crop) {
      return card.image_uris.border_crop;
    }
    // Handle double-faced cards
    if (card.card_faces?.[0]?.image_uris?.border_crop) {
      return card.card_faces[0].image_uris.border_crop;
    }
    return ''; // Fallback if no image is found
  };

  const renderCard = ({ item }: { item: Card }) => {
    const imageUri = getCardImage(item);
    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image
            source={{ uri: imageUri }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  };

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
        <Pressable style={styles.navButton} onPress={() => router.push('/filter')}>
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
        numColumns={GRID_COLUMNS}
        contentContainerStyle={styles.cardsList}
        columnWrapperStyle={styles.row}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Use the filter to search for cards
            </Text>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    //padding: GRID_PADDING,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    //marginBottom: 8,
    padding: GRID_PADDING,
  },
  searchInput: {
    backgroundColor: '#111',
    borderRadius: 8,
    marginLeft: 8,
    flex: 1,
    paddingHorizontal: 12,
    height: 40,
    color: 'white',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 8,
    backgroundColor: '#333',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    width: 80,
    textAlign: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  navButtonText: {
    color: 'white',
    marginLeft: 0,
  },
  cardsList: {
    paddingVertical: CARD_MARGIN,
  },
  row: {
    justifyContent: 'flex-start',
  },
  cardContainer: {
    margin: CARD_MARGIN,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#222',
    borderRadius: 8,
    overflow: 'hidden',
    // Add shadow for better visual separation
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
  },
});
