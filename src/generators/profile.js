export function buildProfile({ identity, contact, capabilities, availability, pricing, portfolio }) {
  return {
    $schema: 'https://tokru.ai/schemas/capability-profile/v1',
    version: '1.0.0',
    identity: {
      name: identity.name,
      handle: identity.handle,
      bio: identity.bio,
      location: {
        city: identity.city,
        timezone: identity.timezone,
      },
    },
    contact: {
      email: contact.email,
      website: identity.website || null,
      avatar_url: identity.avatar_url || null,
      calendar: contact.calendar,
      github: identity.github || null,
      linkedin: identity.linkedin || null,
    },
    capabilities,
    availability,
    pricing: {
      currency: pricing.currency,
      hourlyRate: pricing.hourlyRate,
      projectMinimum: pricing.projectMinimum,
      engagementTypes: pricing.engagementTypes,
    },
    work: {
      employmentTypes: [],
      portfolio: portfolio || [],
    },
    agentCard: {
      endpoint: null,
      a2aCompatible: false,
      queryable: false,
    },
  };
}
