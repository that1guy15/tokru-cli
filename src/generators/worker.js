function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderCapabilities(capabilities) {
  return capabilities.map(c => {
    const tags = (c.tags || []).map(t => `<span class="badge">${escapeHtml(t)}</span>`).join(' ');
    return `<div class="cap">
      <span class="cap-label">${escapeHtml(c.label)}</span>
      <span class="cap-level">${escapeHtml(c.level)}</span>
      <p class="cap-desc">${escapeHtml(c.description)}</p>
      <div class="tags">${tags}</div>
    </div>`;
  }).join('\n');
}

function renderLinks(contact) {
  const links = [];
  if (contact.website) links.push(`<a href="${escapeHtml(contact.website)}">Website</a>`);
  if (contact.github)  links.push(`<a href="${escapeHtml(contact.github)}">GitHub</a>`);
  if (contact.linkedin) links.push(`<a href="${escapeHtml(contact.linkedin)}">LinkedIn</a>`);
  links.push(`<a href="/.well-known/tokru.json">Profile JSON</a>`);
  links.push(`<a href="/.well-known/agent-card.json">Agent Card</a>`);
  return links.join('\n    ');
}

function renderPortfolio(portfolio) {
  if (!portfolio || portfolio.length === 0) return '';
  const items = portfolio.map(p => {
    const title = p.url
      ? `<a href="${escapeHtml(p.url)}">${escapeHtml(p.title)}</a>`
      : escapeHtml(p.title);
    return `<div class="portfolio-item"><strong>${title}</strong><p>${escapeHtml(p.description)}</p></div>`;
  }).join('\n');
  return `<h2>Work</h2>\n${items}`;
}

function renderAvailability(availability) {
  if (!availability) return '';
  const status = availability.status || 'unknown';
  const color = status === 'available' ? '#22c55e' : status === 'limited' ? '#f59e0b' : '#94a3b8';
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  const note = availability.note ? `<span class="avail-note"> — ${escapeHtml(availability.note)}</span>` : '';
  return `<p class="avail"><span class="avail-dot" style="background:${color}"></span><strong>${label}</strong>${note}</p>`;
}

export function buildWorkerScript(profile, agentCard) {
  const profileJson = JSON.stringify(profile, null, 2);
  const agentCardJson = JSON.stringify(agentCard, null, 2);

  const name = profile.identity.name;
  const handle = profile.identity.handle;
  const bio = profile.identity.bio;
  const location = profile.identity.location;
  const contact = profile.contact || {};

  const pricing = profile.pricing;
  const hourlyText = pricing?.hourlyRate
    ? (pricing.hourlyRate.min && pricing.hourlyRate.max
        ? `$${pricing.hourlyRate.min}–$${pricing.hourlyRate.max}/hr`
        : pricing.hourlyRate.max ? `Up to $${pricing.hourlyRate.max}/hr`
        : pricing.hourlyRate.min ? `From $${pricing.hourlyRate.min}/hr` : '')
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(name)} — Tokru</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1a1a2e; min-height: 100vh; }
    .page { max-width: 680px; margin: 0 auto; padding: 2rem 1rem 4rem; }
    .header { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; }
    .name { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
    .handle { color: #64748b; font-size: 0.95rem; margin-bottom: 1rem; }
    .bio { color: #334155; line-height: 1.6; margin-bottom: 1.25rem; }
    .avail { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; margin-bottom: 1rem; }
    .avail-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .avail-note { color: #64748b; }
    .location { color: #64748b; font-size: 0.875rem; }
    .links { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.25rem; }
    .links a { color: #0066cc; font-size: 0.875rem; text-decoration: none; }
    .links a:hover { text-decoration: underline; }
    .section { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.25rem; }
    .section h2 { font-size: 1rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
    .cap { padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; }
    .cap:last-child { border-bottom: none; padding-bottom: 0; }
    .cap-label { font-weight: 600; display: inline; }
    .cap-level { display: inline; background: #e0f2fe; color: #0369a1; padding: 0.1rem 0.5rem; border-radius: 20px; font-size: 0.75rem; margin-left: 0.5rem; }
    .cap-desc { color: #475569; font-size: 0.9rem; line-height: 1.5; margin: 0.35rem 0 0.5rem; }
    .tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
    .badge { background: #f1f5f9; color: #475569; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.75rem; }
    .pricing-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .pricing-badge { background: #f0fdf4; color: #166534; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.85rem; }
    .portfolio-item { padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; }
    .portfolio-item:last-child { border-bottom: none; }
    .portfolio-item p { color: #475569; font-size: 0.9rem; margin-top: 0.25rem; }
    .tokru-footer { text-align: center; color: #94a3b8; font-size: 0.8rem; margin-top: 2rem; }
    .tokru-footer a { color: #94a3b8; }
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="name">${escapeHtml(name)}</div>
    <div class="handle">@${escapeHtml(handle)}</div>
    <p class="bio">${escapeHtml(bio)}</p>
    ${renderAvailability(profile.availability)}
    ${location?.city ? `<div class="location">📍 ${escapeHtml(location.city)}</div>` : ''}
    <div class="links">
      ${renderLinks(contact)}
    </div>
  </div>

  <div class="section">
    <h2>Capabilities</h2>
    ${renderCapabilities(profile.capabilities || [])}
  </div>

  ${pricing ? `<div class="section">
    <h2>Pricing</h2>
    <div class="pricing-row">
      ${hourlyText ? `<span class="pricing-badge">${escapeHtml(hourlyText)}</span>` : ''}
      ${(pricing.engagementTypes || []).map(t => `<span class="pricing-badge">${escapeHtml(t)}</span>`).join('\n      ')}
    </div>
  </div>` : ''}

  ${renderPortfolio(profile.work?.portfolio)}

  <div class="tokru-footer">Powered by <a href="https://tokru.ai">Tokru</a></div>
</div>
</body>
</html>`;

  return `// Tokru Capability Profile Worker — ${handle}
// Generated by create-tokru-profile

const PROFILE_JSON = ${JSON.stringify(profileJson)};
const AGENT_CARD_JSON = ${JSON.stringify(agentCardJson)};
const HTML = ${JSON.stringify(html)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    if (path === '/.well-known/agent-card.json') {
      return new Response(AGENT_CARD_JSON, {
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    if (path === '/.well-known/tokru.json') {
      return new Response(PROFILE_JSON, {
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    return new Response(HTML, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', ...cors },
    });
  },
};
`;
}

export function buildWranglerToml(handle, accountId) {
  return `name = "tokru-${handle}"
main = "worker.js"
compatibility_date = "2024-01-01"
account_id = "${accountId}"
`;
}
