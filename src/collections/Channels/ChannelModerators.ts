import type { CollectionConfig } from 'payload'

export const ChannelModerators: CollectionConfig = {
  slug: 'channel-moderators',

  admin: { group: 'Creator Channels' },

  fields: [
    { name: 'channel', type: 'relationship', relationTo: 'creator-channels', required: true },
    { name: 'user', type: 'relationship', relationTo: 'profiles', required: true },

    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Manager', value: 'manager' },
        { label: 'Editor', value: 'editor' },
        { label: 'Moderator', value: 'moderator' },
      ],
    },

    { name: 'permissions', type: 'json' },
  ],
}
