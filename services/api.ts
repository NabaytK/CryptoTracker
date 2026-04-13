const BASE = typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
  ? '/.netlify/functions' 
  : '/.netlify/functions';

// calls the market api and gets back the current price for each coin
export async function getMultiplePrices(ids: string[]): Promise<Record<string, any>> {
  try {
    const idsStr = ids.join(',');
    const r = await fetch(`${BASE}/market?ids=${idsStr}`);
    const d = await r.json();
    const result: Record<string, any> = {};
    if (Array.isArray(d)) {
      d.forEach((c: any) => {
        result[c.id] = {
          usd: c.current_price || 0,
          usd_24h_change: c.price_change_percentage_24h || 0,
          usd_market_cap: c.market_cap || 0,
        };
      });
    }
    return result;
  } catch { return {}; }
}

// gets the top coins by market cap to show in the market screen
export async function getTopMarketCoins(limit = 50): Promise<any[]> {
  try {
    const r = await fetch(`${BASE}/market?limit=${limit}`);
    const d = await r.json();
    if (!Array.isArray(d)) return [];
    return d.map((c: any) => ({
      id: c.id,
      symbol: c.symbol,
      name: c.name,
      current_price: c.current_price || 0,
      market_cap: c.market_cap || 0,
      price_change_percentage_24h: c.price_change_percentage_24h || 0,
      total_volume: c.total_volume || 0,
      market_cap_rank: c.market_cap_rank || 0,
      high_24h: c.high_24h || 0,
      low_24h: c.low_24h || 0,
      ath: c.ath || 0,
      ath_change_percentage: c.ath_change_percentage || 0,
      image: c.image || '',
    }));
  } catch { return []; }
}

// gets the current bitcoin price and how much it changed today
export async function getBitcoinData(): Promise<any> {
  try {
    const r = await fetch(`${BASE}/market?ids=bitcoin`);
    const d = await r.json();
    if (!Array.isArray(d) || !d[0]) return { usd: 0, usd_24h_change: 0, usd_market_cap: 0 };
    return {
      usd: d[0].current_price || 0,
      usd_24h_change: d[0].price_change_percentage_24h || 0,
      usd_market_cap: d[0].market_cap || 0,
    };
  } catch { return { usd: 0, usd_24h_change: 0, usd_market_cap: 0 }; }
}

// searches for coins by name or ticker symbol
export async function searchCoins(query: string): Promise<any[]> {
  try {
    const r = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`);
    const d = await r.json();
    if (!d.coins) return [];
    return d.coins.slice(0, 10).map((c: any) => ({
      id: c.id,
      symbol: c.symbol,
      name: c.name,
      current_price: 0,
    }));
  } catch { return []; }
}

export async function getCoinMarketData(id: string): Promise<any> {
  try {
    const r = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`);
    const d = await r.json();
    return d.market_data || {};
  } catch { return {}; }
}

// gets the latest crypto news articles to show in the news screen
export async function getCryptoNews(): Promise<any[]> {
  try {
    const r = await fetch(`${BASE}/news`);
    const d = await r.json();
    if (!d.Data) return [];
    return d.Data.map((item: any) => ({
      title: item.title || '',
      url: item.url || '',
      body: item.body || '',
      published_on: item.published_on || 0,
      source_info: { name: item.source_info?.name || 'News' },
    }));
  } catch { return []; }
}
