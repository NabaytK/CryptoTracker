exports.handler = async function() {
  try {
    const r = await fetch('https://cointelegraph.com/rss');
    const text = await r.text();
    const items = [];
    const itemMatches = text.match(/<item>([\s\S]*?)<\/item>/g) || [];
    for (const item of itemMatches.slice(0, 20)) {
      const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/))?.[1] || '';
      const rawLink = (item.match(/<link>(.*?)<\/link>/) || [])[1] || '';
      const link = rawLink.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      const desc = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/))?.[1] || '';
      const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || '';
      if (!title || !link) continue;
      items.push({
        title: title.trim(),
        url: link,
        body: desc.replace(/<[^>]+>/g, '').slice(0, 200).trim(),
        published_on: pubDate ? new Date(pubDate).getTime() / 1000 : Date.now() / 1000,
        source_info: { name: 'CoinTelegraph' },
      });
    }
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ Data: items }),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
