// gets coin market data from coingecko and sends it to the app
exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const ids = params.ids || '';
  const limit = params.limit || '50';

  const url = ids
    ? `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false`
    : `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;

  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'CryptoTracker/1.0',
  };

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (attempt > 0) await new Promise(r => setTimeout(r, attempt * 2000));
      const res = await fetch(url, { headers });
      if (res.status === 429) continue;
      if (!res.ok) return { statusCode: res.status, body: JSON.stringify({ error: 'API error' }) };
      const data = await res.json();
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=30',
        },
        body: JSON.stringify(data),
      };
    } catch (e) {
      if (attempt === 2) return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 429, body: JSON.stringify({ error: 'Rate limited, try again shortly' }) };
};
