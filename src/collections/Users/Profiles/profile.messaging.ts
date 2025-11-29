// src/collections/Profiles/profile.messaging.ts

import type { Field } from 'payload'

export const profileMessagingFields: Field[] = [
  { name: 'inbox', type: 'relationship', relationTo: 'inbox', hasMany: true },
  { name: 'messages', type: 'relationship', relationTo: 'messages', hasMany: true },
  { name: 'chats', type: 'relationship', relationTo: 'chats', hasMany: true },
  { name: 'mentions', type: 'relationship', relationTo: 'mentions', hasMany: true },
]
