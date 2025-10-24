export interface Location {
  id: string;
  uuid?: string; // Some parts of the code still use uuid
  street: string;
  city: string;
  state: string;
  region: string;
  country: string;
  postal_code: string;
  latitude: number | string;
  longitude: number | string;
  full_location: string;
  markets_count?: number;
  markets?: any[];
  created_at: string;
  updated_at: string;
}
