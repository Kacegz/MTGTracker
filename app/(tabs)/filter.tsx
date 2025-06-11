import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { router } from 'expo-router';
import { searchCards } from '../services/scryfall';
import type { SearchResponse } from '../types/card';
import { Picker } from '@react-native-picker/picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants'; // ADD: Import Constants for status bar height

type ColorMode = 'exact' | 'including' | 'atMost';

export default function FilterScreen() {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [type, setType] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCommanderColors, setSelectedCommanderColors] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [colorMode, setColorMode] = useState<ColorMode>('exact');

  const translateColor = (color: string): string => {
    if (color === 'Blue') return 'U';
    //if (color === 'Colorless') return 'C';
    return color.charAt(0);
  };

  const toggleColor = (color: string, isCommander: boolean = false) => {
    const translatedColor = translateColor(color);
    if (isCommander) {
      setSelectedCommanderColors(prev => 
        prev.includes(translatedColor) 
          ? prev.filter(c => c !== translatedColor)
          : [...prev, translatedColor]
      );
    } else {
      setSelectedColors(prev => 
        prev.includes(translatedColor) 
          ? prev.filter(c => c !== translatedColor)
          : [...prev, translatedColor]
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
      {isSelected && (
        <Ionicons 
          name="checkmark" 
          size={28} 
          color="#4A90E2" 
          style={styles.checkmark}
        />
      )}
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
    const searchParams = {
      name,
      text,
      type,
      colors: selectedColors,
      color_mode: colorMode,
      commander_colors: selectedCommanderColors,
      rarity: selectedRarities,
      order: 'name'
    };
    
    // Navigate to search screen with search parameters
    router.push({
      pathname: '/(tabs)/search',
      params: { 
        searchParams: JSON.stringify(searchParams)
      }
    });
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* ADD: Status bar spacer */}
      <StatusBar style="light" backgroundColor="#111" />
      <View style={styles.statusBarSpacer} />
      <ScrollView style={styles.scrollView}>
        {/*<View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backButton}>←</Text>
          </Pressable>
        </View>*/}

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
              isSelected={selectedColors.includes(translateColor('White'))}
              onPress={() => toggleColor('White')}
              />
              <Text style={styles.TextButton}>
                White
              </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedColors.includes(translateColor('Blue'))}
              onPress={() => toggleColor('Blue')}
            />
            <Text style={styles.TextButton}>
              Blue
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedColors.includes(translateColor('Black'))}
              onPress={() => toggleColor('Black')}
            />
            <Text style={styles.TextButton}>
              Black
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedColors.includes(translateColor('Red'))}
              onPress={() => toggleColor('Red')}
            />
            <Text style={styles.TextButton}>
              Red
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedColors.includes(translateColor('Green'))}
              onPress={() => toggleColor('Green')}
            />
            <Text style={styles.TextButton}>
              Green
            </Text>
            </View>
             <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedColors.includes(translateColor('Colorless'))}
              onPress={() => toggleColor('Colorless')}
            />
            <Text style={styles.TextButton}>
              Colorless
            </Text>
            </View>
          </View>
          <View style={[styles.inputContainer, styles.noBorder, styles.selectContainer]}>
            <View style={styles.colorModeContainer}>
              <Picker
                selectedValue={colorMode}
                onValueChange={(value) => setColorMode(value as ColorMode)}
                style={[
                  styles.colorModePicker,
                  Platform.OS === 'android' && {
                    backgroundColor: '#222',
                    color: 'white',
                  }
                ]}
                dropdownIconColor="#666"
                mode="dropdown"
                itemStyle={[
                  styles.pickerItem,
                  Platform.OS === 'android' && {
                    backgroundColor: '#222',
                    color: 'white',
                  }
                ]}
              >
                <Picker.Item 
                  label="Exactly these colors" 
                  value="exact" 
                  color="white"
                  style={{ backgroundColor: '#222' }}
                />
                <Picker.Item 
                  label="Including these colors" 
                  value="including" 
                  color="white"
                  style={{ backgroundColor: '#222' }}
                />
                <Picker.Item 
                  label="At most these colors" 
                  value="atMost" 
                  color="white"
                  style={{ backgroundColor: '#222' }}
                />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.colorSection}>
          <Text style={styles.label}>Commander</Text>
          <View style={styles.colorGrid}>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedCommanderColors.includes(translateColor('White'))}
              onPress={() => toggleColor('White', true)}
            />
            <Text style={styles.TextButton}>
              White
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedCommanderColors.includes(translateColor('Blue'))}
              onPress={() => toggleColor('Blue', true)}
            />
            <Text style={styles.TextButton}>
              Blue
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedCommanderColors.includes(translateColor('Black'))}
              onPress={() => toggleColor('Black', true)}
            />
            <Text style={styles.TextButton}>
              Black
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedCommanderColors.includes(translateColor('Red'))}
              onPress={() => toggleColor('Red', true)}
            />
            <Text style={styles.TextButton}>
              Red
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedCommanderColors.includes(translateColor('Green'))}
              onPress={() => toggleColor('Green', true)}
            />
            <Text style={styles.TextButton}>
              Green
            </Text>
            </View>
            <View style={styles.colorItem}>
            <ColorButton 
              color="" 
              isSelected={selectedCommanderColors.includes(translateColor('Colorless'))}
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
  statusBarSpacer: {
  height: Constants.statusBarHeight,
  backgroundColor: '#111',
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
    marginBottom: 16,
    marginTop: 2,
    marginLeft: -6,
    fontSize: 18,
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
    width: 48,
    height: 48,
    backgroundColor: '#111',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },

  TextButton:{
    width: '100%',
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  colorButtonSelected: {
    backgroundColor: '#111',
    borderColor: '#4A90E2',
  },
  checkmark: {
    position: 'absolute',
  },
  colorButtonText: {
    color: 'white',
    fontSize: 11,
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
    justifyContent: 'space-between',
    gap: 12,
  },
  rarityButton: {
    backgroundColor: '#111',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  rarityButtonSelected: {
    backgroundColor: '#4A90E2',
    borderWidth: 0,
    borderColor: '#4A90E2',
  },
  rarityButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
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
  colorModeContainer: {
    backgroundColor: '#222',
    borderRadius: 45,
    overflow: 'hidden',
    paddingTop: 0,
    borderWidth: 2,
    borderColor: '#333',
    height: 52,
    justifyContent: 'center',
  },
  colorModePicker: {
    color: 'white',
    height: 52,
    backgroundColor: '#111',
    paddingHorizontal: 12,
    borderWidth: 0,
    marginRight: 10,
    paddingTop: Platform.select({
      android: -4,
      default: 0,
    }),
    textAlignVertical: 'center',
    includeFontPadding: false,
    paddingBottom: 0,
  },
  pickerItem: {
    color: 'white',
    backgroundColor: '#111',
    borderWidth: 0,
    fontSize: 16,
    textAlignVertical: 'center',
    includeFontPadding: false,
    height: 52,
  },
  selectContainer: {
    paddingTop: 0,
  },
  noBorder: {
    borderTopWidth: 0,
  },
}); 