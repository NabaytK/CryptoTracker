// gets coin market data from coingecko and sends it to the app
exports.handler = async function(event) {
  try {
    const params = event.queryStringParameters || {};
    const limit = params.limit || 50;
    const ids = params.ids || '';

    let url = ids
      ? `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false`
      : `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;

    const r = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!r.ok) {
      return { statusCode: r.status, body: JSON.stringify({ error: 'upstream error' }) };
    }

    const data = await r.json();

    const result = data.map((c) => ({
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

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
