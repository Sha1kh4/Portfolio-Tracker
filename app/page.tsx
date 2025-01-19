'use client';

import React, { useState, useEffect } from 'react';
import AddStockForm from '../components/AddStockForm';
import StockList from '../components/StockList';
import PortfolioDashboard from '../components/PortfolioDashboard';
import { Stock, stockApi } from '../services/api';

export default function Home() {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const data = await stockApi.getAllStocks();
      setStocks(data);
    } catch (error) {
      console.error('Failed to load stocks:', error);
    }
  };

  const handleAddStock = async (newStock: Omit<Stock, 'currentPrice'>) => {
    try {
      const addedStock = await stockApi.addStock(newStock);
      setStocks([...stocks, addedStock]);
    } catch (error) {
      console.error('Failed to add stock:', error);
    }
  };

  const handleDeleteStock = async (symbol: string) => {
    try {
      await stockApi.deleteStock(Number(symbol));
      setStocks(stocks.filter(stock => stock.ticker !== symbol));
    } catch (error) {
      console.error('Failed to delete stock:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Tracker</h1>
          <p className="mt-2 text-gray-600">Track your stock portfolio in real-time</p>
        </div>

        <div className="space-y-8">
          <PortfolioDashboard />
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Stock</h2>
            <AddStockForm onAddStock={handleAddStock} currentStockCount={stocks.length} />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Portfolio</h2>
            <StockList stocks={stocks} onDeleteStock={handleDeleteStock} />
          </div>
        </div>
      </div>
    </main>
  );
}
