exports.handler = async function(event) {
  try {
    const params = event.queryStringParameters || {};
    const limit = params.limit || 50;
    const ids = params.ids || '';
    
    let url = ids
      ? `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`
      : `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`;
    
    const r = await fetch(url);
    const d = await r.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
