import { Alert } from 'react-native';
import { SearchParams, SearchResponse } from '../types/card';

const BASE_URL = 'https://api.scryfall.com';

const getRarityCode = (rarity: string): string => {
  switch (rarity.toLowerCase()) {
    case 'common': return 'c';
    case 'uncommon': return 'u';
    case 'rare': return 'r';
    case 'mythic': return 'm';
    default: return rarity.toLowerCase();
  }
};

export async function searchCards(params: SearchParams): Promise<SearchResponse | null> {
  try {
    let query = '';
    
    // If q parameter is present, use it directly as the query
    if (params.q) {
      query = `game:paper ${params.q}`;
    } else {
      // Otherwise, build the query from individual parameters
      const conditions: string[] = ['game:paper'];

      if (params.name) {
        conditions.push(`name:"${params.name}"`);
      }
      if (params.text) {
        conditions.push(`oracle:"${params.text}"`);
      }
      if (params.type) {
        const types = params.type.split(',').map(t => t.trim());
        if (types.length > 1) {
          const typeQueries = types.map(t => `type:${t}`);
          conditions.push(`(${typeQueries.join(' ')})`);
        } else {
          conditions.push(`type:${params.type}`);
        }
      }
      if (params.colors && params.colors.length > 0) {
        const colorQuery = params.colors.join('');
        switch (params.color_mode) {
          case 'exact':
            conditions.push(`color=${colorQuery}`);
            break;
          case 'including':
            conditions.push(`color>=${colorQuery}`);
            break;
          case 'atMost':
            conditions.push(`color<=${colorQuery}`);
            break;
        }
      }
      if (params.commander_colors && params.commander_colors.length > 0) {
        conditions.push(`commander:${params.commander_colors.join('')}`);
      }
      if (params.rarity && params.rarity.length > 0) {
        const rarityQueries = params.rarity.map(r => `rarity:${getRarityCode(r)}`);
        conditions.push(`(${rarityQueries.join(' OR ')})`);
      }
      if (params.order) {
        conditions.push(`order:${params.order}`);
      }

      query = conditions.join(' ');
    }

    const page = params.page || 1;
    const url = `${BASE_URL}/cards/search?q=${encodeURIComponent(query)}&page=${page}`;
    console.log('Search URL:', url);

    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        // Return empty results for "not found" instead of throwing an error
        return {
          data: [],
          has_more: false,
          total_cards: 0
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching cards:', error);
    Alert.alert('Error', 'Failed to search cards. Please try again.');
    return null;
  }
} 