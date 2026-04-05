exports.handler = async function() {
  try {
    const r = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&limit=20');
    const d = await r.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(d),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
