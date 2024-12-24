'use client';

interface Stock {
  symbol: string;
  shares: number;
  purchasePrice: number;
  currentPrice?: number;
}

interface StockListProps {
  stocks: Stock[];
  onDeleteStock: (symbol: string) => void;
}

export default function StockList({ stocks, onDeleteStock }: StockListProps) {
  const calculateGainLoss = (stock: Stock) => {
    if (!stock.currentPrice) return 0;
    return ((stock.currentPrice - stock.purchasePrice) * stock.shares).toFixed(2);
  };

  const calculatePercentageChange = (stock: Stock) => {
    if (!stock.currentPrice) return 0;
    return (((stock.currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100).toFixed(2);
  };

  if (stocks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4M12 20V4" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No stocks in your portfolio</h3>
        <p className="text-gray-500">Add your first stock using the form above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Loss</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Change</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {stocks.map((stock) => {
            const gainLoss = Number(calculateGainLoss(stock));
            const percentChange = Number(calculatePercentageChange(stock));
            
            return (
              <tr key={stock.symbol} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-medium mr-3">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <span className="font-medium text-gray-900">{stock.symbol}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{stock.shares}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">${stock.purchasePrice.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {stock.currentPrice ? (
                    `$${stock.currentPrice.toFixed(2)}`
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Loading...
                    </span>
                  )}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap font-medium ${gainLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ${Math.abs(gainLoss).toFixed(2)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap font-medium ${percentChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  <div className="flex items-center space-x-1">
                    <span>{percentChange >= 0 ? '↑' : '↓'}</span>
                    <span>{Math.abs(percentChange)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => onDeleteStock(stock.symbol)}
                    className="inline-flex items-center px-3 py-1.5 border border-rose-200 text-sm font-medium rounded-lg text-rose-600 
                      bg-rose-50 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
} 