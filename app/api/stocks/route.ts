import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchStockPrice } from '@/lib/stockUtils';
import { stocks } from '@/lib/store';

// Validation schema for stock data
const StockSchema = z.object({
  symbol: z.string().min(1).max(5).toUpperCase(),
  shares: z.number().positive(),
  purchasePrice: z.number().positive(),
});

export async function GET() {
  try {
    const stocksWithPrices = await Promise.all(
      stocks.map(async (stock) => {
        try {
          const currentPrice = await fetchStockPrice(stock.symbol);
          return { ...stock, currentPrice };
        } catch (error) {
          console.error(`Error fetching price for ${stock.symbol}:`, error);
          return stock;
        }
      })
    );

    return NextResponse.json(stocksWithPrices);
  } catch (error) {
    console.error('Failed to fetch stocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stocks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedStock = StockSchema.parse(body);
    
    // Check if stock already exists
    if (stocks.some(s => s.symbol === validatedStock.symbol)) {
      return NextResponse.json(
        { error: 'Stock already exists in portfolio' },
        { status: 400 }
      );
    }

    try {
      // Get current price
      const currentPrice = await fetchStockPrice(validatedStock.symbol);
      
      const newStock = {
        ...validatedStock,
        currentPrice,
        id: Date.now(), // Simple ID generation
      };

      stocks.push(newStock);

      return NextResponse.json(newStock, { status: 201 });
    } catch (error) {
      console.error('Error fetching stock price:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stock price' },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid stock data', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Failed to add stock:', error);
    return NextResponse.json(
      { error: 'Failed to add stock' },
      { status: 500 }
    );
  }
} 