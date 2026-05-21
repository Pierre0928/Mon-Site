import { Drink } from './DrinkCard';

export interface BundleItem {
  drinkId: string;
  quantity: number;
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  items: BundleItem[];
  price: number;
  costPrice?: number;
  image?: string;
}
