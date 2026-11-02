// Devolve IP e país do visitante no mesmo formato do /cdn-cgi/trace da Cloudflare.
// O vercel.json aponta /cdn-cgi/trace para cá, então o bloco de captação de leads
// do kit funciona na Vercel sem nenhuma alteração.
module.exports = (req, res) => {
  const h = req.headers;
  const ip = String(h['x-real-ip'] || h['x-forwarded-for'] || '').split(',')[0].trim();
  const dec = (v) => { try { return decodeURIComponent(v || ''); } catch (e) { return v || ''; } };
  const linhas = [
    'ip=' + ip,
    'loc=' + (h['x-vercel-ip-country'] || ''),
    'colo=' + String(h['x-vercel-id'] || '').split('::')[0],
    'region=' + (h['x-vercel-ip-country-region'] || ''),
    'city=' + dec(h['x-vercel-ip-city']),
    'ts=' + (Date.now() / 1000).toFixed(3),
  ];
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(linhas.join('\n') + '\n');
};
