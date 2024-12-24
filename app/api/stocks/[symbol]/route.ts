import { NextResponse } from 'next/server';
import { fetchStockPrice } from '@/lib/stockUtils';
import { stocks } from '../route';  // Import the stocks array

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const currentPrice = await fetchStockPrice(params.symbol);
    return NextResponse.json({ price: currentPrice });
  } catch (error) {
    console.error('Failed to fetch stock price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock price' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbolToDelete = params.symbol.toUpperCase();
    const initialLength = stocks.length;
    
    stocks = stocks.filter(stock => stock.symbol !== symbolToDelete);
    
    if (stocks.length === initialLength) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Failed to delete stock:', error);
    return NextResponse.json(
      { error: 'Failed to delete stock' },
      { status: 500 }
    );
  }
} 