import type { CollectionConfig } from 'payload'

export const PollIPLogs: CollectionConfig = {
  slug: 'poll-ip-logs',
  fields: [
    { name: 'pollId', type: 'number', required: true },
    { name: 'ip', type: 'text', required: true },
  ],
}
