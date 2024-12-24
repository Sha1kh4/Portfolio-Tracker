import { NextResponse } from 'next/server';
import { fetchStockPrice } from '@/lib/stockUtils';
import { stocks } from '@/lib/store';

type Params = Promise<{ symbol: string }>;

export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const symbol = (await params).symbol;
    const currentPrice = await fetchStockPrice(symbol);
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
  { params }: { params: Params }
) {
  try {
    const symbol = (await params).symbol;
    const symbolToDelete = symbol.toUpperCase();
    const initialLength = stocks.length;
    
    stocks.splice(0, stocks.length, ...stocks.filter(stock => stock.symbol !== symbolToDelete));
    
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