import { useEffect, useState } from 'react';

// One place for all LocalStorage keys, so we never mistype them.
export const STORAGE_KEYS = {
  products: 'suki:products',
  sales: 'suki:sales',
  expenses: 'suki:expenses',
  customers: 'suki:customers',
  payments: 'suki:payments',
  settings: 'suki:settings',
} as const;

// Works like useState, but saves to LocalStorage and reloads it on refresh.
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      // Corrupted or blocked storage: fall back to the starting value.
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Suki could not save data:', error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}