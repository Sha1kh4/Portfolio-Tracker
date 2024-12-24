'use client';

import { useState, useEffect } from 'react';
import AddStockForm from './AddStockForm';
import StockList from './StockList';
import { getStocks, addStock, deleteStock } from '@/lib/api';

interface Stock {
  symbol: string;
  shares: number;
  purchasePrice: number;
  currentPrice?: number;
}

export default function PortfolioDashboard() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStocks() {
      try {
        const fetchedStocks = await getStocks();
        setStocks(fetchedStocks);
      } catch (error) {
        console.error('Failed to load stocks:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStocks();
  }, []);

  const calculateTotalValue = () => {
    return stocks.reduce((total, stock) => {
      const currentValue = stock.currentPrice 
        ? stock.shares * stock.currentPrice 
        : stock.shares * stock.purchasePrice;
      return total + currentValue;
    }, 0).toFixed(2);
  };

  const calculateTotalGainLoss = () => {
    return stocks.reduce((total, stock) => {
      if (!stock.currentPrice) return total;
      const gainLoss = (stock.currentPrice - stock.purchasePrice) * stock.shares;
      return total + gainLoss;
    }, 0).toFixed(2);
  };

  const handleAddStock = async (newStock: Omit<Stock, 'currentPrice'>) => {
    try {
      const addedStock = await addStock(newStock);
      setStocks([...stocks, addedStock]);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add stock');
    }
  };

  const handleDeleteStock = async (symbol: string) => {
    if (confirm('Are you sure you want to delete this stock from your portfolio?')) {
      try {
        await deleteStock(symbol);
        setStocks(stocks.filter(stock => stock.symbol !== symbol));
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete stock');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const totalGainLoss = Number(calculateTotalGainLoss());

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
            Stock Portfolio Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Manage your investments and track their performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-3">
              <h2 className="text-sm font-medium text-white uppercase tracking-wider">
                Total Portfolio Value
              </h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-4xl font-bold text-gray-900">
                ${calculateTotalValue()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className={`px-6 py-3 ${totalGainLoss >= 0 ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-rose-500 to-red-500'}`}>
              <h2 className="text-sm font-medium text-white uppercase tracking-wider">
                Total Gain/Loss
              </h2>
            </div>
            <div className="px-6 py-4">
              <p className={`text-4xl font-bold ${totalGainLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {totalGainLoss >= 0 ? '+' : '-'}${Math.abs(totalGainLoss)}
              </p>
            </div>
          </div>
        </div>
      
        <div className="space-y-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-3">
              <h2 className="text-lg font-semibold text-white">Add New Stock</h2>
            </div>
            <div className="p-6">
              <AddStockForm onAddStock={handleAddStock} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-3">
              <h2 className="text-lg font-semibold text-white">Your Portfolio</h2>
            </div>
            <div className="p-6">
              <StockList stocks={stocks} onDeleteStock={handleDeleteStock} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 