# create-tokru-profile

**Publish a machine-readable capability profile for the AI era — discoverable by humans and agents in under 15 minutes.**

[![npm version](https://img.shields.io/npm/v/create-tokru-profile.svg)](https://www.npmjs.com/package/create-tokru-profile)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What is Tokru?

[Tokru](https://tokru.ai) is trust infrastructure for the AI economy. It gives professionals a standardized, machine-readable capability profile — discoverable by search, queryable by AI agents, and owned by you.

Think of it as your professional presence for the AI era:

- **Humans** discover you via [tokru.ai/directory](https://tokru.ai/directory)
- **AI agents** query your structured capability data via the registry API
- **Your AI assistant** manages your profile over time — just by talking to it

---

## Quick Start

```bash
npx create-tokru-profile
```

That's it. The interactive wizard takes about 10 minutes and walks you through everything.

---

## What You Get

After completing the wizard, you'll have:

| File | What it is |
|---|---|
| `capability-profile.json` | Your full structured profile (the source of truth) |
| `agent-card.json` | Machine-readable identity for AI agent discovery |
| `TOKRU.md` | Handoff document for your AI assistant |
| `worker/` | Deployable Cloudflare Worker (optional) |

Your profile is also automatically registered at [tokru.ai](https://tokru.ai) — discoverable immediately.

---

## The Wizard

The CLI walks through 8 steps:

1. **Identity** — name, handle, bio, location, timezone, website, avatar
2. **Social links** — GitHub, LinkedIn (moved here so agents can find them)
3. **Contact** — email, calendar link
4. **Capabilities** — what you do, at what level, with what tools
5. **Availability** — status, hours/week, start date, engagement preferences
6. **Pricing** — rates, project minimums, engagement types
7. **Portfolio** — showcase real work (title, description, URL, tags)
8. **Deploy** — optionally deploy a personal portfolio Worker to Cloudflare

---

## Connecting Your AI Assistant

After running the wizard, hand your `TOKRU.md` file to any AI assistant:

**OpenClaw**
```
Drop TOKRU.md into your OpenClaw workspace.
Your AI discovers it automatically and can manage your profile.
```

**Claude Code / Claude Desktop**
```
Add TOKRU.md to your project context or workspace.
Then just talk: "Update my availability to busy starting next week."
```

**ChatGPT / Any assistant**
```
Paste the contents of TOKRU.md into your conversation.
The AI understands your profile and can suggest improvements.
```

From that point, managing your professional profile is just a conversation.

---

## Additional Commands

```bash
# Update an existing profile
tokru update

# Connect your AI assistant
tokru connect-ai
```

---

## Deploying Your Portfolio

The wizard optionally deploys a personal portfolio Worker to Cloudflare. You'll need:
- A Cloudflare account (free tier works)
- A Cloudflare API token with Workers:Edit permissions

Your deployed Worker serves:
- `your-handle.workers.dev` — human-readable portfolio page
- `/.well-known/tokru.json` — full capability profile (machine-readable)
- `/.well-known/agent-card.json` — A2A agent card

**Custom domains** are supported — point your domain to the Worker via Cloudflare DNS.

---

## Platform Support

| Platform | Status |
|---|---|
| Cloudflare Workers | ✅ Built-in |
| Vercel | 🔜 Community ([contribute!](CONTRIBUTING.md)) |
| Netlify | 🔜 Community ([contribute!](CONTRIBUTING.md)) |
| Deno Deploy | 🔜 Community ([contribute!](CONTRIBUTING.md)) |

---

## Registry & Discovery

All profiles are registered at [tokru.ai](https://tokru.ai).

**Search the registry:**
```bash
curl "https://tokru.ai/search?q=devops+kubernetes"
```

**Query with AI:**
```bash
curl -X POST https://tokru.ai/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Python engineer available for short-term contracts"}'
```

**View a profile:**
```
https://tokru.ai/profile/your-handle
```

---

## The Capability Profile Schema

Your `capability-profile.json` follows the open [Tokru v1 schema](https://tokru.ai/schemas/capability-profile/v1):

```json
{
  "$schema": "https://tokru.ai/schemas/capability-profile/v1",
  "version": "1.0.0",
  "identity": { "name": "...", "handle": "...", "bio": "..." },
  "contact": { "email": "...", "website": "..." },
  "capabilities": [
    { "label": "Platform Engineering", "level": "expert", "tags": ["kubernetes", "terraform"] }
  ],
  "availability": { "status": "available", "hoursPerWeek": 20 },
  "pricing": { "currency": "USD", "hourlyRate": { "min": 150, "max": 200 } }
}
```

Capability levels: `learner` → `practitioner` → `expert` → `pioneer`

---

## Contributing

We welcome contributions — especially new platform adapters. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT © [Tokru](https://tokru.ai)
