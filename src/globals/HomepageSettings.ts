// src/globals/HomepageSettings.ts
import type { GlobalConfig } from 'payload'
import { HeroFields } from '@/fields'

export const HomepageSettings: GlobalConfig = {
  slug: 'homepage-settings',
  label: 'Homepage Settings',

  admin: { group: 'SYSTEM' },

  fields: [
    HeroFields,
    {
      name: 'layoutOrder',
      type: 'array',
      label: 'Section Order',
      admin: {
        description: 'Controls the ordering of homepage sections.',
      },
      fields: [
        {
          name: 'section',
          type: 'select',
          options: [
            { label: 'Trending', value: 'trending' },
            { label: 'Latest', value: 'latest' },
            { label: 'Featured Articles', value: 'articles' },
            { label: 'Featured Media', value: 'media' },
            { label: 'Live Channels', value: 'live' },
            { label: 'VOD Picks', value: 'vod' },
            { label: 'Playlists', value: 'music' },
          ],
        },
      ],
    },
  ],
}
