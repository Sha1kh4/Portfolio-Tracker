import { Stock } from '@/types';

// Using const with a type annotation for the stocks array
export const stocks: Stock[] = [];

// Add a function to modify the array since we're using const
export function updateStocks(newStocks: Stock[]): void {
  stocks.length = 0;  // Clear the array
  stocks.push(...newStocks);  // Add new items
}

export function addStock(stock: Stock): void {
  stocks.push(stock);
}

export function removeStock(symbol: string): void {
  const index = stocks.findIndex(s => s.symbol === symbol);
  if (index > -1) {
    stocks.splice(index, 1);
  }
} 