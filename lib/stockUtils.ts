const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

export async function fetchStockPrice(symbol: string): Promise<number> {
  try {
    // Using Alpha Vantage API
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if we got the expected data structure
    if (!data['Global Quote'] || !data['Global Quote']['05. price']) {
      throw new Error('Invalid API response format');
    }

    const price = Number(data['Global Quote']['05. price']);

    if (isNaN(price)) {
      throw new Error('Invalid price data received');
    }

    return price;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    throw new Error(`Failed to fetch price for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 