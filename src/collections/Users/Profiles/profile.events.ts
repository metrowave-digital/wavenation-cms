// src/collections/Profiles/profile.events.ts

import type { Field } from 'payload'

export const profileEventFields: Field[] = [
  { name: 'eventsAttending', type: 'relationship', relationTo: 'events', hasMany: true },
  { name: 'eventsHosting', type: 'relationship', relationTo: 'events', hasMany: true },
  { name: 'tickets', type: 'relationship', relationTo: 'tickets', hasMany: true },
  { name: 'eventPasses', type: 'relationship', relationTo: 'event-passes', hasMany: true },
]
