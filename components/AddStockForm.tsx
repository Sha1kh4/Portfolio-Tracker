'use client';

import { useState, useRef, useEffect } from 'react';
import { popularStocks } from '@/lib/stockSymbols';

interface AddStockFormProps {
  onAddStock: (stock: { symbol: string; shares: number; purchasePrice: number }) => void;
}

export default function AddStockForm({ onAddStock }: AddStockFormProps) {
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof popularStocks>([]);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle clicks outside of suggestions dropdown
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSymbolChange = (value: string) => {
    setSymbol(value);
    if (value.length > 0) {
      const filtered = popularStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(value.toLowerCase()) ||
        stock.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (selectedSymbol: string) => {
    setSymbol(selectedSymbol);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!symbol || !shares || !purchasePrice) {
        throw new Error('Please fill in all fields');
      }

      onAddStock({
        symbol: symbol.toUpperCase(),
        shares: Number(shares),
        purchasePrice: Number(purchasePrice)
      });

      // Reset form
      setSymbol('');
      setShares('');
      setPurchasePrice('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative">
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-2">
            Stock Symbol
          </label>
          <input
            type="text"
            id="symbol"
            value={symbol}
            onChange={(e) => handleSymbolChange(e.target.value)}
            onFocus={() => symbol && setShowSuggestions(true)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="e.g., AAPL"
            disabled={isLoading}
            autoComplete="off"
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionRef}
              className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-auto"
            >
              {suggestions.map((stock) => (
                <button
                  key={stock.symbol}
                  type="button"
                  onClick={() => handleSelectSuggestion(stock.symbol)}
                  className="w-full px-4 py-2 text-left hover:bg-indigo-50 flex items-center space-x-3"
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-medium">
                    {stock.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{stock.symbol}</div>
                    <div className="text-sm text-gray-500">{stock.name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="shares" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Shares
          </label>
          <input
            type="number"
            id="shares"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            min="0"
            step="1"
            placeholder="0"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Purchase Price ($)
          </label>
          <input
            type="number"
            id="price"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            min="0"
            step="0.01"
            placeholder="0.00"
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-xl
          hover:from-indigo-700 hover:to-blue-700 focus:ring-4 focus:ring-indigo-300 transition-all disabled:opacity-50
          disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Adding...</span>
          </>
        ) : (
          <span>Add Stock</span>
        )}
      </button>
    </form>
  );
} 