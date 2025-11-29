// src/collections/Profiles/profile.notifications.ts

import type { Field } from 'payload'

export const profileNotificationFields: Field[] = [
  {
    name: 'notificationRules',
    type: 'relationship',
    relationTo: 'notification-rules',
    hasMany: true,
  },

  {
    name: 'notifications',
    type: 'relationship',
    relationTo: 'notifications',
    hasMany: true,
  },

  {
    name: 'notificationPreferences',
    type: 'group',
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'emailEnabled', type: 'checkbox', defaultValue: true },
          { name: 'pushEnabled', type: 'checkbox', defaultValue: true },
          { name: 'smsEnabled', type: 'checkbox', defaultValue: false },
          { name: 'inAppEnabled', type: 'checkbox', defaultValue: true },
        ],
      },
      {
        name: 'categories',
        type: 'select',
        hasMany: true,
        options: [
          { label: 'New Follows', value: 'follows' },
          { label: 'Comments & Replies', value: 'comments' },
          { label: 'Likes & Reactions', value: 'reactions' },
          { label: 'Creator Channel Posts', value: 'channel_posts' },
          { label: 'Live Stream Alerts', value: 'livestreams' },
          { label: 'Event Updates', value: 'events' },
          { label: 'Platform Announcements', value: 'system' },
        ],
      },
    ],
  },
]
