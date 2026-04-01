export async function getMultiplePrices(ids: string[]): Promise<Record<string, any>> {
  try {
    const idsStr = ids.join(',');
    const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${idsStr}&vs_currencies=usd&include_24h_change=true&include_market_cap=true`);
    const d = await r.json();
    const result: Record<string, any> = {};
    for (const id of ids) {
      if (d[id]) {
        result[id] = {
          usd: d[id].usd || 0,
          usd_24h_change: d[id].usd_24h_change || 0,
          usd_market_cap: d[id].usd_market_cap || 0,
        };
      }
    }
    return result;
  } catch { return {}; }
}

export async function getTopMarketCoins(limit = 50): Promise<any[]> {
  try {
    const r = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`);
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

export async function getBitcoinData(): Promise<any> {
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24h_change=true&include_market_cap=true');
    const d = await r.json();
    return {
      usd: d.bitcoin?.usd || 0,
      usd_24h_change: d.bitcoin?.usd_24h_change || 0,
      usd_market_cap: d.bitcoin?.usd_market_cap || 0,
    };
  } catch { return { usd: 0, usd_24h_change: 0, usd_market_cap: 0 }; }
}

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

export async function getCryptoNews(): Promise<any[]> {
  try {
    const r = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&limit=20');
    const d = await r.json();
    return d.Data || [];
  } catch { return []; }
}
