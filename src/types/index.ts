// All the data shapes Suki uses. Later stages build on these.

export type PageId =
  | 'today'
  | 'sell'
  | 'stock'
  | 'expenses'
  | 'utang'
  | 'reports'
  | 'settings';

export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  dateAdded: string; // ISO date string
}

export type PaymentMethod = 'cash' | 'utang';

export interface SaleItem {
  productId: string;
  productName: string; // saved so old sales still make sense if a product is renamed/deleted
  quantity: number;
  unitPrice: number; // selling price at the time of sale
  unitCost: number; // cost price at the time of sale (used for profit)
}

export interface Sale {
  id: string;
  createdAt: string; // ISO date-time string
  items: SaleItem[];
  total: number;
  paymentMethod: PaymentMethod;
  customerId?: string; // only for utang sales
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string; // ISO date-time string
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  contact?: string;
  dateAdded: string;
}

// Money a customer paid toward their utang.
// Balance = (total of that customer's utang sales) - (total of their payments)
export interface CustomerPayment {
  id: string;
  customerId: string;
  amount: number;
  date: string; // ISO date-time string
  note?: string;
}

export interface AppSettings {
  businessName: string;
}