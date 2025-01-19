'use client';

import React, { useEffect, useState } from 'react';
import { PortfolioSummary, stockApi } from '../services/api';
import AddStockForm from './AddStockForm';
import StockList from './StockList';
import { getStocks, addStock, deleteStock } from '@/lib/api';

interface Stock {
  symbol: string;
  shares: number;
  purchasePrice: number;
  currentPrice?: number;
}

const PortfolioDashboard: React.FC = () => {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    fetchSummary();
    loadStocks();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await stockApi.getPortfolioSummary();
      setSummary(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch portfolio summary');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const loadStocks = async () => {
    try {
      const fetchedStocks = await getStocks();
      setStocks(fetchedStocks);
    } catch (error) {
      console.error('Failed to load stocks:', error);
    }
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

  if (loading) return <div className="text-center p-4">Loading portfolio data...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!summary) return <div className="text-center p-4">No portfolio data available</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 bg-clip-text  ">
            Stock Portfolio Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Manage your investments and track their performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Value</h3>
            <p className="text-3xl font-bold text-indigo-600">
              ${summary.totalValue.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Gain/Loss</h3>
            <p className={`text-3xl font-bold ${summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(summary.totalGainLoss).toFixed(2)}
              <span className="text-lg ml-1">
                ({summary.gainLossPercentage >= 0 ? '+' : ''}{summary.gainLossPercentage.toFixed(2)}%)
              </span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Top Performer</h3>
            {summary.topPerformer ? (
              <p className="text-3xl font-bold text-indigo-600">
                {summary.topPerformer.ticker}
                <span className="text-lg text-green-600 ml-2">
                  +{summary.topPerformer.gainPercentage.toFixed(2)}%
                </span>
              </p>
            ) : (
              <p className="text-gray-500">No top performer yet</p>
            )}
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
};

export default PortfolioDashboard; 