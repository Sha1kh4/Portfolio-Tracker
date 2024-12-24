import { Stock } from '@/types';

export async function getStocks(): Promise<Stock[]> {
  const response = await fetch('/api/stocks');
  if (!response.ok) {
    throw new Error('Failed to fetch stocks');
  }
  return response.json();
}

export async function addStock(stock: Omit<Stock, 'currentPrice'>): Promise<Stock> {
  const response = await fetch('/api/stocks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stock),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add stock');
  }

  return response.json();
}

export async function deleteStock(symbol: string): Promise<void> {
  const response = await fetch(`/api/stocks/${symbol}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete stock');
  }
}

export async function getStockPrice(symbol: string): Promise<number> {
  const response = await fetch(`/api/stocks/${symbol}`);
  if (!response.ok) {
    throw new Error('Failed to fetch stock price');
  }
  const data = await response.json();
  return data.price;
} 