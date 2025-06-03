import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { searchCards } from '../services/scryfall';
import type { SearchResponse } from '../types/card';

export default function FilterScreen() {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [type, setType] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCommanderColors, setSelectedCommanderColors] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleColor = (color: string, isCommander: boolean = false) => {
    if (isCommander) {
      setSelectedCommanderColors(prev => 
        prev.includes(color) 
          ? prev.filter(c => c !== color)
          : [...prev, color]
      );
    } else {
      setSelectedColors(prev => 
        prev.includes(color) 
          ? prev.filter(c => c !== color)
          : [...prev, color]
      );
    }
  };

  const toggleRarity = (rarity: string) => {
    setSelectedRarities(prev =>
      prev.includes(rarity)
        ? prev.filter(r => r !== rarity)
        : [...prev, rarity]
    );
  };

  const ColorButton = ({ color, isSelected, onPress }: { color: string; isSelected: boolean; onPress: () => void }) => (
    <Pressable 
      style={[styles.colorButton, isSelected && styles.colorButtonSelected]} 
      onPress={onPress}
    >
      <Text style={styles.colorButtonText}>{color}</Text>
    </Pressable>
  );

  const RarityButton = ({ rarity, isSelected, onPress }: { rarity: string; isSelected: boolean; onPress: () => void }) => (
    <Pressable 
      style={[styles.rarityButton, isSelected && styles.rarityButtonSelected]} 
      onPress={onPress}
    >
      <Text style={styles.rarityButtonText}>{rarity}</Text>
    </Pressable>
  );

  const handleSearch = async () => {
    setIsLoading(true);
    const results = await searchCards({
      name,
      text,
      type,
      colors: selectedColors,
      commander_colors: selectedCommanderColors,
      rarity: selectedRarities,
      order: 'name'
    });
    setIsLoading(false);
    
    if (results) {
      const searchResponse = results as SearchResponse;
      // Navigate back to search screen with results
      router.push({
        pathname: '/(tabs)/search',
        params: { 
          searchResults: JSON.stringify(searchResponse.data)
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backButton}>←</Text>
          </Pressable>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Card Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Any words in the name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Text</Text>
          <TextInput
            style={styles.input}
            placeholder="Any text"
            placeholderTextColor="#666"
            value={text}
            onChangeText={setText}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Type Line</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter type"
            placeholderTextColor="#666"
            value={type}
            onChangeText={setType}
          />
        </View>

        <View style={styles.colorSection}>
          <Text style={styles.label}>Colors</Text>
          <View style={styles.colorGrid}>
            <View style={styles.colorItem}>
              <ColorButton 
              color="" 
              isSelected={selectedColors.includes('White')}
              onPress={() => toggleColor('White')}
              />
              <Text style={styles.TextButton}>
                White
              </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedColors.includes('Blue')}
              onPress={() => toggleColor('Blue')}
            />
            <Text style={styles.TextButton}>
              Blue
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedColors.includes('Black')}
              onPress={() => toggleColor('Black')}
            />
            <Text style={styles.TextButton}>
              Black
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedColors.includes('Red')}
              onPress={() => toggleColor('Red')}
            />
            <Text style={styles.TextButton}>
              Red
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedColors.includes('Green')}
              onPress={() => toggleColor('Green')}
            />
            <Text style={styles.TextButton}>
              Green
            </Text>
            </View>
             <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedColors.includes('Colorless')}
              onPress={() => toggleColor('Colorless')}
            />
            <Text style={styles.TextButton}>
              Colorless
            </Text>
            </View>
          </View>
        </View>

        <View style={styles.colorSection}>
          <Text style={styles.label}>Commander</Text>
          <View style={styles.colorGrid}>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedCommanderColors.includes('White')}
              onPress={() => toggleColor('White', true)}
            />
            <Text style={styles.TextButton}>
              White
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedCommanderColors.includes('Blue')}
              onPress={() => toggleColor('Blue', true)}
            />
            <Text style={styles.TextButton}>
              Blue
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedCommanderColors.includes('Black')}
              onPress={() => toggleColor('Black', true)}
            />
            <Text style={styles.TextButton}>
              Black
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedCommanderColors.includes('Red')}
              onPress={() => toggleColor('Red', true)}
            />
            <Text style={styles.TextButton}>
              Red
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedCommanderColors.includes('Green')}
              onPress={() => toggleColor('Green', true)}
            />
            <Text style={styles.TextButton}>
              Green
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedCommanderColors.includes('Colorless')}
              onPress={() => toggleColor('Colorless', true)}
            />
            <Text style={styles.TextButton}>
              Colorless
            </Text>
            </View>
          </View>
        </View>

        <View style={styles.raritySection}>
          <Text style={styles.label}>Rarity</Text>
          <View style={styles.rarityGrid}>
            <RarityButton
              rarity="Common"
              isSelected={selectedRarities.includes('Common')}
              onPress={() => toggleRarity('Common')}
            />
            <RarityButton
              rarity="Uncommon"
              isSelected={selectedRarities.includes('Uncommon')}
              onPress={() => toggleRarity('Uncommon')}
            />
            <RarityButton
              rarity="Rare"
              isSelected={selectedRarities.includes('Rare')}
              onPress={() => toggleRarity('Rare')}
            />
            <RarityButton
              rarity="Mythic"
              isSelected={selectedRarities.includes('Mythic')}
              onPress={() => toggleRarity('Mythic')}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.searchButtonContainer}>
        <Pressable 
          style={styles.searchButton} 
          onPress={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.searchButtonText}>Search Cards</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    padding: 0,
  },
  scrollView: {
    flex: 1,
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    marginLeft: 25,
  },
  backButton: {
    color: 'white',
    fontSize: 24,
  },
  inputContainer: {
    marginBottom: 8,
    paddingVertical: 10,
    borderTopWidth: 1, 
    borderTopColor: '#000',
    padding: 25,
  },
  label: {
    color: 'white',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#111',
    borderRadius: 45,
    padding: 12,
    color: 'white',
    fontSize: 16,
  },
  colorSection: {
    marginTop: 0,
    borderTopWidth: 1, 
    borderTopColor: '#000',
    paddingHorizontal: 25,
    paddingVertical: 5,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
  },

  colorItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%', // 3 kolumny
    marginBottom: 16,
  },

  colorItemText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },

  colorButton: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 60,
    backgroundColor: '#111',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  TextButton:{
    width: 80,
    height: 40,
    color: 'white',
    fontSize: 18,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
  },
  colorButtonSelected: {
    backgroundColor: '#4A90E2',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  colorCheckmark: {
    position: 'absolute',
    top: 4,
    right: 4,
  },

  colorButtonText: {
    color: 'white',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },

  raritySection: {
    marginTop: 8,
    marginBottom: 80,
    borderTopWidth: 1, 
    borderTopColor: '#000',
    paddingHorizontal: 25,
    paddingVertical: 5,
  },
  rarityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-between",
  },
  rarityButton: {
    backgroundColor: '#111',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,

  },
  rarityButtonSelected: {
    backgroundColor: '#4A90E2',
    borderWidth: 0,
    borderColor: '#4A90E2',
  },
  rarityButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  searchButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  searchButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
}); 