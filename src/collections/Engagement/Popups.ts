import type { CollectionConfig } from 'payload'

export const Popups: CollectionConfig = {
  slug: 'popups',

  admin: {
    group: 'Engagement',
    useAsTitle: 'title',
    defaultColumns: ['title', 'trigger', 'active', 'startsAt', 'endsAt'],
  },

  access: {
    read: () => true,
    create: ({ req }) => !!req.user?.roles?.includes('admin'),
    update: ({ req }) => !!req.user?.roles?.includes('admin'),
    delete: ({ req }) => !!req.user?.roles?.includes('admin'),
  },

  fields: [
    { name: 'title', type: 'text', required: true },

    { name: 'content', type: 'richText', required: true },

    { name: 'active', type: 'checkbox', defaultValue: true },

    {
      name: 'location',
      type: 'select',
      defaultValue: 'global',
      options: [
        { label: 'Global', value: 'global' },
        { label: 'Home', value: 'home' },
        { label: 'Radio', value: 'radio' },
        { label: 'TV / Plus', value: 'tv' },
        { label: 'Creators', value: 'creators' },
        { label: 'Events', value: 'events' },
      ],
    },

    {
      name: 'trigger',
      type: 'select',
      defaultValue: 'on_load',
      options: [
        { label: 'On Load', value: 'on_load' },
        { label: 'Delay', value: 'delay' },
        { label: 'Scroll', value: 'scroll' },
        { label: 'Exit Intent', value: 'exit' },
        { label: 'Logged Out Only', value: 'logged_out' },
        { label: 'Logged In Only', value: 'logged_in' },
      ],
    },

    {
      type: 'row',
      fields: [
        { name: 'delayMs', type: 'number', admin: { width: '33%' } },
        { name: 'scrollPercent', type: 'number', admin: { width: '33%' } },
        {
          name: 'showOncePerSession',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '33%' },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        { name: 'startsAt', type: 'date', admin: { width: '50%' } },
        { name: 'endsAt', type: 'date', admin: { width: '50%' } },
      ],
    },

    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },

    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

export default Popups
