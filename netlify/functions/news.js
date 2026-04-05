exports.handler = async function() {
  try {
    const Parser = require('rss-parser');
    const parser = new Parser();
    const feeds = [
      'https://cointelegraph.com/rss',
      'https://coindesk.com/arc/outboundfeeds/rss/',
    ];
    const allItems = [];
    for (const feed of feeds) {
      try {
        const parsed = await parser.parseURL(feed);
        allItems.push(...parsed.items.slice(0, 10).map(item => ({
          title: item.title || '',
          url: item.link || '',
          body: item.contentSnippet || item.summary || '',
          published_on: new Date(item.pubDate || Date.now()).getTime() / 1000,
          source_info: { name: parsed.title || 'News' },
        })));
      } catch {}
    }
    allItems.sort((a, b) => b.published_on - a.published_on);
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ Data: allItems }),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
