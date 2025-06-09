import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Card } from './types/card';

const FORMAT_DISPLAY_NAMES: { [key: string]: string } = {
  standard: 'Standard',
  alchemy: 'Alchemy',
  pioneer: 'Pioneer',
  historic: 'Historic',
  modern: 'Modern',
  brawl: 'Brawl',
  legacy: 'Legacy',
  timeless: 'Timeless',
  vintage: 'Vintage',
  pauper: 'Pauper',
  commander: 'Commander',
  penny: 'Penny',
  oathbreaker: 'Oathbreaker'
};

type FormatKey = keyof typeof FORMAT_DISPLAY_NAMES;
type LegalityType = 'legal' | 'not_legal' | 'restricted' | 'banned' | undefined;

// Define the order of formats we want to display
const FORMAT_ORDER: FormatKey[] = [
  'standard',
  'alchemy',
  'pioneer',
  'historic',
  'modern',
  'brawl',
  'legacy',
  'timeless',
  'vintage',
  'pauper',
  'commander',
  'penny',
  'oathbreaker'
];

export default function CardDetailsScreen() {
  const { card } = useLocalSearchParams<{ card: string }>();
  const cardData: Card = JSON.parse(card);

  const getCardImage = (card: Card): string => {
    if (card.image_uris?.border_crop) {
      return card.image_uris.border_crop;
    }
    if (card.card_faces?.[0]?.image_uris?.border_crop) {
      return card.card_faces[0].image_uris.border_crop;
    }
    return '';
  };

  const formatLegality = (legality: string | undefined) => {
    if (!legality) return 'Not Legal';
    switch (legality) {
      case 'legal': return 'Legal';
      case 'not_legal': return 'Not Legal';
      case 'restricted': return 'Restricted';
      case 'banned': return 'Banned';
      default: return 'Not Legal';
    }
  };

  const getLegalityColor = (legality: string | undefined) => {
    if (!legality) return '#666';
    switch (legality) {
      case 'legal': return '#4CAF50';
      case 'not_legal': return '#666';
      case 'restricted': return '#FFC107';
      case 'banned': return '#F44336';
      default: return '#666';
    }
  };

  const getFormatDisplayName = (format: FormatKey): string => {
    return FORMAT_DISPLAY_NAMES[format];
  };

  const getLegality = (format: FormatKey): LegalityType => {
    return cardData.legalities?.[format as keyof typeof cardData.legalities];
  };

  return (
    <View style={styles.container}>
      {/*<View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Card Details</Text>
      </View>*/}

      <ScrollView style={styles.scrollView}>
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: getCardImage(cardData) }}
            style={styles.cardImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.cardName}>{cardData.name}</Text>
          
          {cardData.mana_cost && (
            <Text style={styles.manaCost}>{cardData.mana_cost}</Text>
          )}

          {cardData.type_line && (
            <Text style={styles.typeLine}>{cardData.type_line}</Text>
          )}

          {cardData.oracle_text && (
            <Text style={styles.oracleText}>{cardData.oracle_text}</Text>
          )}

          {cardData.power && cardData.toughness && (
            <Text style={styles.powerToughness}>
              {cardData.power}/{cardData.toughness}
            </Text>
          )}

          {cardData.legalities && (
            <View style={styles.legalitiesContainer}>
              <Text style={styles.sectionTitle}>Legalities</Text>
              <View style={styles.legalitiesGrid}>
                {FORMAT_ORDER.map(format => {
                  const legality = getLegality(format);
                  return (
                    <View key={format} style={styles.legalityItem}>
                      <Text style={styles.formatName}>{getFormatDisplayName(format)}</Text>
                      <Text style={[styles.legalityStatus, { color: getLegalityColor(legality) }]}>
                        {formatLegality(legality)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {cardData.prices && (
            <View style={styles.pricesContainer}>
              <Text style={styles.sectionTitle}>Prices</Text>
              <View style={styles.pricesGrid}>
                {cardData.prices.usd && (
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>USD</Text>
                    <Text style={styles.priceValue}>${cardData.prices.usd}</Text>
                  </View>
                )}
                {cardData.prices.usd_foil && (
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>USD Foil</Text>
                    <Text style={styles.priceValue}>${cardData.prices.usd_foil}</Text>
                  </View>
                )}
                {cardData.prices.eur && (
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>EUR</Text>
                    <Text style={styles.priceValue}>€{cardData.prices.eur}</Text>
                  </View>
                )}
                {cardData.prices.eur_foil && (
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>EUR Foil</Text>
                    <Text style={styles.priceValue}>€{cardData.prices.eur_foil}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  cardImageContainer: {
    alignItems: 'center',
    padding: 16,
  },
  cardImage: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  },
  detailsContainer: {
    padding: 16,
  },
  cardName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  manaCost: {
    color: 'white',
    fontSize: 18,
    marginBottom: 8,
  },
  typeLine: {
    color: 'white',
    fontSize: 16,
    marginBottom: 16,
  },
  oracleText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  powerToughness: {
    color: 'white',
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  legalitiesContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  legalitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legalityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    padding: 8,
    borderRadius: 4,
    minWidth: '45%',
  },
  formatName: {
    color: 'white',
    fontSize: 14,
    marginRight: 8,
  },
  legalityStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  pricesContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  pricesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  priceItem: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 4,
    minWidth: '45%',
  },
  priceLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  priceValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
}); 