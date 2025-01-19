'use client';

import React, { useState } from 'react';
import { Stock, stockApi } from '../services/api';

interface AddStockFormProps {
  onAddStock: (newStock: Omit<Stock, 'currentPrice'>) => Promise<void>;
  currentStockCount: number;
}

const AddStockForm: React.FC<AddStockFormProps> = ({ onAddStock, currentStockCount }) => {
  const [formData, setFormData] = useState<Omit<Stock, 'id' | 'currentPrice' | 'totalValue'>>({
    name: '',
    ticker: '',
    quantity: 1,
    buyPrice: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateForm = (): string | null => {
    if (currentStockCount >= 5) {
      return 'Maximum portfolio size (5 stocks) reached';
    }
    if (!formData.name.trim()) {
      return 'Company name is required';
    }
    if (!formData.ticker.trim()) {
      return 'Ticker symbol is required';
    }
    if (!/^[A-Z]{1,5}$/.test(formData.ticker)) {
      return 'Ticker must be 1-5 uppercase letters';
    }
    if (formData.quantity !== 1) {
      return 'Quantity must be 1';
    }
    if (formData.buyPrice <= 0) {
      return 'Buy price must be greater than 0';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onAddStock({
        ...formData,
        ticker: formData.ticker.toUpperCase(),
        quantity: 1
      });
      setFormData({
        name: '',
        ticker: '',
        quantity: 1,
        buyPrice: 0,
      });
    } catch (err) {
      setError('Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'buyPrice' ? Number(value) : 
              name === 'ticker' ? value.toUpperCase() : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={100}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
          />
        </div>

        <div>
          <label htmlFor="ticker" className="block text-sm font-medium text-gray-700">
            Ticker Symbol (1-5 letters)
          </label>
          <input
            type="text"
            id="ticker"
            name="ticker"
            value={formData.ticker}
            onChange={handleChange}
            required
            maxLength={5}
            pattern="[A-Z]{1,5}"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black uppercase"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity (fixed at 1)
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={1}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="buyPrice" className="block text-sm font-medium text-gray-700">
            Buy Price ($)
          </label>
          <input
            type="number"
            id="buyPrice"
            name="buyPrice"
            value={formData.buyPrice}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm mt-2">{error}</div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {currentStockCount}/5 stocks in portfolio
        </div>
        <button
          type="submit"
          disabled={loading || currentStockCount >= 5}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            (loading || currentStockCount >= 5) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Adding...' : 'Add Stock'}
        </button>
      </div>
    </form>
  );
};

export default AddStockForm; 