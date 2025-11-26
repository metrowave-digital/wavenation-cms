// src/collections/HomepageMediaFeed.ts
import type { CollectionConfig } from 'payload'

export const HomepageMediaFeed: CollectionConfig = {
  slug: 'homepage-media-feed',

  admin: {
    useAsTitle: 'title',
    group: 'On-Demand',
  },

  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
    create: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Homepage — VOD, Music & Live TV',
      admin: { readOnly: true },
    },

    /* -------------------------------------------
     * HERO SECTION (VOD, MUSIC, or LIVE TV)
     * ------------------------------------------- */
    {
      name: 'heroType',
      type: 'select',
      required: true,
      defaultValue: 'vod',
      options: [
        { label: 'VOD', value: 'vod' },
        { label: 'Music', value: 'music' },
        { label: 'Live TV', value: 'live-tv' },
      ],
    },

    {
      name: 'heroMedia',
      type: 'relationship',
      relationTo: ['vod', 'tracks'],
      admin: {
        condition: (_, sibling) => sibling.heroType === 'vod' || sibling.heroType === 'music',
      },
    },

    {
      name: 'heroLiveTV',
      type: 'group',
      admin: { condition: (_, sibling) => sibling.heroType === 'live-tv' },
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'WaveNation TV — Live',
        },
        {
          name: 'streamUrl',
          type: 'text',
          required: true,
        },
        {
          name: 'thumbnailUrl',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },

    /* -------------------------------------------
     * ROW SECTIONS (VOD / MUSIC / LIVE TV)
     * ------------------------------------------- */
    {
      name: 'sections',
      type: 'array',
      label: 'Homepage Media Rows',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'VOD', value: 'vod' },
            { label: 'Music', value: 'music' },
            { label: 'Live TV', value: 'live-tv' },
          ],
        },

        // VOD + Music items
        {
          name: 'items',
          type: 'relationship',
          relationTo: ['vod', 'tracks'],
          hasMany: true,
          admin: {
            condition: (_, sibling) => sibling.type === 'vod' || sibling.type === 'music',
          },
        },

        // Live TV block (optional)
        {
          name: 'liveTV',
          type: 'group',
          admin: { condition: (_, sibling) => sibling.type === 'live-tv' },
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Now Streaming Live' },
            {
              name: 'streamUrl',
              type: 'text',
              required: true,
            },
            {
              name: 'thumbnailUrl',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
        },

        {
          name: 'sortOrder',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
  ],
}
