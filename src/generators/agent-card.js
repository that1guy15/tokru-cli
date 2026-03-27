export function buildAgentCard(profile) {
  const website = profile.contact.website || `https://tokru.ai/${profile.identity.handle}`;

  return {
    $schema: 'https://tokru.ai/schemas/agent-card/v1',
    name: profile.identity.name,
    handle: profile.identity.handle,
    description: profile.identity.bio,
    url: website,
    capabilities: profile.capabilities.map((c) => ({
      id: c.id,
      label: c.label,
      level: c.level,
      tags: c.tags,
    })),
    availability: {
      status: profile.availability.status,
      remote: profile.availability.remote,
      updatedAt: profile.availability.updatedAt,
    },
    contact: {
      email: profile.contact.email,
      website: profile.contact.website,
      calendar: profile.contact.calendar,
    },
    a2a: {
      methods: [
        {
          type: 'web',
          url: website,
        },
      ],
    },
  };
}
