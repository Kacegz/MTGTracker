import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Dimensions, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // pakiet ikon
import { router, useLocalSearchParams } from 'expo-router';
import type { Card } from '../types/card';
import { searchCards } from '../services/scryfall';

// Calculate dimensions for the grid
const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 12;
const CARD_MARGIN = 6;
const GRID_COLUMNS = 2;

// Calculate card width based on screen size and grid parameters
const CARD_WIDTH = (SCREEN_WIDTH - (GRID_PADDING * 2) - (CARD_MARGIN * (GRID_COLUMNS - 1))) / GRID_COLUMNS;
// Use MTG card aspect ratio (63mm × 88mm)
const CARD_HEIGHT = CARD_WIDTH * (88 / 63);

export default function CardGridScreen() {
  const params = useLocalSearchParams<{ searchParams?: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<any>(null);
  const [totalCards, setTotalCards] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const CARDS_PER_PAGE = 175;

  useEffect(() => {
    if (params.searchParams) {
      // Reset page to 1 when new search parameters are received
      setCurrentPage(1);
      setHasSearched(true);
      const parsedParams = JSON.parse(params.searchParams);
      console.log('Received search params:', parsedParams);
      setSearchParams(parsedParams);
    }
  }, [params.searchParams]);

  useEffect(() => {
    const performSearch = async () => {
      if (searchParams) {
        setIsLoading(true);
        try {
          const searchQuery = {
            ...searchParams,
            page: currentPage
          };
          console.log('Search query:', searchQuery);
          const results = await searchCards(searchQuery);
          if (results) {
            setCards(results.data);
            setTotalCards(results.total_cards || 0);
          }
          console.log(results);
        } catch (error) {
          console.error('Error performing search:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    performSearch();
  }, [searchParams, currentPage]);

  const handleManualSearch = async () => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      setCurrentPage(1);
      setHasSearched(true);
      try {
        const manualSearchParams = {
          q: searchQuery,
          page: 1
        };
        setSearchParams(manualSearchParams);
        const results = await searchCards(manualSearchParams);
        if (results) {
          setCards(results.data);
          setTotalCards(results.total_cards || 0);
        }
      } catch (error) {
        console.error('Error performing manual search:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage * CARDS_PER_PAGE < totalCards) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const isLastPage = currentPage * CARDS_PER_PAGE >= totalCards;

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
      <Pressable 
        style={styles.cardContainer}
        onPress={() => router.push({
          pathname: '/card-details',
          params: { card: JSON.stringify(item) }
        })}
      >
        <View style={styles.card}>
          <Image
            source={{ uri: imageUri }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </View>
      </Pressable>
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
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleManualSearch}
          returnKeyType="search"
        />
      </View>

      {/* Nawigacja: Previous | Filter | Next */}
      <View style={styles.navBar}>
        <Pressable 
          style={[styles.navButton, currentPage === 1 && styles.navButtonDisabled]} 
          onPress={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <Text style={[styles.navButtonText, currentPage === 1 && styles.navButtonTextDisabled]}>Previous</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.push('/filter')}>
          <Ionicons name="filter-outline" size={20} color="white" />
          <Text style={styles.navButtonText}>Filter</Text>
        </Pressable>
        <Pressable 
          style={[styles.navButton, isLastPage && styles.navButtonDisabled]} 
          onPress={handleNextPage}
          disabled={isLastPage}
        >
          <Text style={[styles.navButtonText, isLastPage && styles.navButtonTextDisabled]}>Next</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a73e8" />
        </View>
      ) : (
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
                {hasSearched ? 'No cards found' : 'Use the filter to search for cards'}
              </Text>
            </View>
          )}
        />
      )}

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
    alignItems: 'center',
  },
  row: {
    justifyContent: 'center',
    paddingHorizontal: CARD_MARGIN,
    width: '100%',
  },
  cardContainer: {
    margin: CARD_MARGIN,
    flex: 1,
    maxWidth: CARD_WIDTH + (CARD_MARGIN * 2),
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#222',
    borderRadius: 8,
    overflow: 'hidden',
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
    minHeight: 200,
  },
  emptyStateText: {
    color: '#999',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonTextDisabled: {
    color: '#666',
  },
});
