// gets coin market data from coincap and sends it to the app
exports.handler = async function(event) {
  try {
    const params = event.queryStringParameters || {};
    const limit = params.limit || 50;
    const ids = params.ids || '';

    let url = ids
      ? `https://api.coincap.io/v2/assets?ids=${ids}&limit=200`
      : `https://api.coincap.io/v2/assets?limit=${limit}`;

    const r = await fetch(url);
    const d = await r.json();
    if (!d.data) return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify([]) };

    const result = d.data.map((c) => ({
      id: c.id,
      symbol: c.symbol.toLowerCase(),
      name: c.name,
      current_price: parseFloat(c.priceUsd) || 0,
      market_cap: parseFloat(c.marketCapUsd) || 0,
      price_change_percentage_24h: parseFloat(c.changePercent24Hr) || 0,
      total_volume: parseFloat(c.volumeUsd24Hr) || 0,
      market_cap_rank: parseInt(c.rank) || 0,
      high_24h: 0,
      low_24h: 0,
      ath: 0,
      ath_change_percentage: 0,
      image: `https://assets.coincap.io/assets/icons/${c.symbol.toLowerCase()}@2x.png`,
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
