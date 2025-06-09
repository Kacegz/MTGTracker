export interface Card {
  id: string;
  name: string;
  mana_cost?: string;
  type_line?: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  image_uris?: {
    border_crop: string;
    art_crop: string;
    normal: string;
    large: string;
    png: string;
    small: string;
  };
  // For double-faced cards
  card_faces?: Array<{
    image_uris: {
      border_crop: string;
      art_crop: string;
      normal: string;
      large: string;
      png: string;
      small: string;
    };
  }>;
  prices?: {
    usd?: string;
    usd_foil?: string;
    eur?: string;
    eur_foil?: string;
  };
  legalities?: Record<'standard' | 'alchemy' | 'pioneer' | 'historic' | 'modern' | 'brawl' | 'legacy' | 'timeless' | 'vintage' | 'pauper' | 'commander' | 'penny' | 'oathbreaker', 'legal' | 'not_legal' | 'restricted' | 'banned' | undefined>;
}

export interface SearchResponse {
  data: Card[];
  has_more: boolean;
  next_page?: string;
  total_cards?: number;
}

export interface SearchParams {
  name?: string;
  text?: string;
  type?: string;
  colors?: string[];
  color_mode?: 'exact' | 'including' | 'atMost';
  commander_colors?: string[];
  rarity?: string[];
  order?: string;
  page?: number;
  q?: string;
} 