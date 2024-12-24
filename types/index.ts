export interface Stock {
  symbol: string;
  shares: number;
  purchasePrice: number;
  currentPrice?: number;
} 