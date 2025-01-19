'use client';

import React, { useEffect, useState } from 'react';
import { Stock, stockApi } from '../services/api';

interface StockListProps {
  stocks: Stock[];
  onDeleteStock: (symbol: string) => Promise<void>;
}

const StockList: React.FC<StockListProps> = ({ stocks, onDeleteStock }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
  }, [stocks]);

  const handleDelete = async (id: number) => {
    try {
      await stockApi.deleteStock(id);
      onDeleteStock(stocks.find(stock => stock.id === id)?.ticker || '');
    } catch (err) {
      setError('Failed to delete stock');
    }
  };

  if (loading) return <div className="text-center p-4">Loading stocks...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stocks.map((stock) => (
            <tr key={stock.id}>
              <td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{stock.ticker}</td>
              <td className="px-6 py-4 whitespace-nowrap">{stock.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">${stock.buyPrice.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">${stock.currentPrice?.toFixed(2) || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">${stock.totalValue?.toFixed(2) || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleDelete(stock.id!)}
                  className="text-red-600 hover:text-red-900 mr-4"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockList; 