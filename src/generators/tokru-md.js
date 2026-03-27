export function buildTokruMd(profile, deployedUrl) {
  const handle = profile.identity.handle;
  const name = profile.identity.name;
  const bio = profile.identity.bio;
  const baseUrl = deployedUrl || `https://tokru.ai/${handle}`;

  return `# TOKRU.md — ${name}

## Who
- **Name:** ${name}
- **Handle:** ${handle}
- **Bio:** ${bio}

## Profile Endpoints
- **Landing page:** ${baseUrl}
- **Full profile JSON:** ${baseUrl}/.well-known/tokru.json
- **Agent Card (A2A):** ${baseUrl}/.well-known/agent-card.json

## How to Update
- Re-run the setup wizard: \`npx create-tokru-profile --update\`
- Or edit \`capability-profile.json\` directly and redeploy with \`npx wrangler deploy\`
- To update just one section: \`tokru update\`

## AI Management
Drop this file into your AI assistant workspace. For OpenClaw or Claude Code,
it will discover and manage your profile automatically.

Your AI assistant can:
- Update \`availability.status\` when engagements start or end
- Add portfolio items when projects ship
- Suggest capability tag updates as your work evolves
- Notify you when your profile is queried via the registry

## Capability Profile Schema
Schema: \`https://tokru.ai/schemas/capability-profile/v1\`
Local file: \`capability-profile.json\`
`;
}
