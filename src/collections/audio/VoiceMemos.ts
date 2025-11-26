// src/collections/VoiceMemos.ts
import type { CollectionConfig } from 'payload'

export const VoiceMemos: CollectionConfig = {
  slug: 'voice-memos',

  admin: {
    useAsTitle: 'filename',
    group: 'Radio',
  },

  upload: {
    mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-m4a'],
  },

  fields: [
    {
      name: 'filename',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
  ],
}
