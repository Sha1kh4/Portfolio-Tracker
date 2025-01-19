import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080/api';

export interface Stock {
  id?: number;
  name: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  currentPrice?: number;
  totalValue?: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvestment: number;
  totalGainLoss: number;
  gainLossPercentage: number;
  topPerformer: {
    ticker: string;
    gainPercentage: number;
  };
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const stockApi = {
  // Get all stocks
  getAllStocks: async (): Promise<Stock[]> => {
    const response = await api.get('/stocks');
    return response.data;
  },

  // Add new stock
  addStock: async (stock: Stock): Promise<Stock> => {
    const response = await api.post('/stocks', stock);
    return response.data;
  },

  // Update stock
  updateStock: async (id: number, stock: Stock): Promise<Stock> => {
    const response = await api.put(`/stocks/${id}`, stock);
    return response.data;
  },

  // Delete stock
  deleteStock: async (id: number): Promise<void> => {
    await api.delete(`/stocks/${id}`);
  },

  // Get portfolio summary
  getPortfolioSummary: async (): Promise<PortfolioSummary> => {
    const response = await api.get('/stocks/portfolio-summary');
    return response.data;
  },
}; 