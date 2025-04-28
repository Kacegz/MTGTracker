import { Alert } from 'react-native';

interface SearchParams {
  name?: string;
  text?: string;
  type?: string;
  colors?: string[];
  commander_colors?: string[];
  rarity?: string[];
  order?: string;
}

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

export const searchCards = async (params: SearchParams) => {
  try {
    // Build query string based on Scryfall's syntax
    let query = ['game:paper']; // Always include paper games
    
    if (params.name) query.push(`name:${params.name}`);
    if (params.text) query.push(`oracle:${params.text}`);
    if (params.type) query.push(`type:${params.type}`);
    
    if (params.colors && params.colors.length > 0) {
      const colorString = params.colors.map(c => c[0].toLowerCase()).join('');
      query.push(`color:${colorString}`);
    }
    
    if (params.commander_colors && params.commander_colors.length > 0) {
      const colorString = params.commander_colors.map(c => c[0].toLowerCase()).join('');
      query.push(`commander:${colorString}`);
    }
    
    if (params.rarity && params.rarity.length > 0) {
      const rarityQueries = params.rarity.map(r => `rarity:${getRarityCode(r)}`);
      query.push(`(${rarityQueries.join(' OR ')})`);
    }

    // Join with + instead of space for proper URL encoding
    const queryString = query.join('+');
    const orderParam = params.order ? `&order=${params.order}` : '';
    
    const response = await fetch(`${BASE_URL}/cards/search?q=${queryString}${orderParam}`, {
      headers: {
        'User-Agent': 'MTGTracker/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Scryfall API Error:', error);
    Alert.alert('Error', 'Failed to search cards. Please try again.');
    return null;
  }
}; 