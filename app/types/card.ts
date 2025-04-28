export interface Card {
  id: string;
  name: string;
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
}

export interface SearchResponse {
  data: Card[];
  has_more: boolean;
  next_page?: string;
  total_cards?: number;
} 