export async function getStockPrice(symbol) {
  const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  
  if (!apiKey) {
    throw new Error('Alpha Vantage API key not found in environment variables');
  }

  const response = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`Alpha Vantage API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data['Note']) {
    throw new Error('API call frequency limit exceeded. Please try again later.');
  }

  if (data['Error Message']) {
    throw new Error(data['Error Message']);
  }

  const quote = data['Global Quote'];
  if (!quote || !quote['05. price']) {
    throw new Error('Invalid stock symbol or no data available');
  }

  const price = parseFloat(quote['05. price']).toFixed(2);
  const change = parseFloat(quote['09. change']).toFixed(2);
  const changePercent = quote['10. change percent'];

  return `${symbol}: $${price} (${change >= 0 ? '+' : ''}${change}, ${changePercent})`;
}

