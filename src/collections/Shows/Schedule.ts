import type { CollectionConfig } from 'payload'

export const Schedule: CollectionConfig = {
  slug: 'schedule',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'dayOfWeek', 'startTime', 'endTime'],
    group: 'Content',
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => {
      const roles = Array.isArray(req.user?.roles) ? req.user.roles : []
      return roles.includes('admin') || roles.includes('super-admin')
    },
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: "Name of the scheduled block (e.g., 'Morning Flow', 'Prime Time TV').",
      },
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'dayOfWeek',
      type: 'select',
      required: true,
      options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
        (d) => ({ label: d, value: d.toLowerCase() }),
      ),
    },

    {
      type: 'row',
      fields: [
        {
          name: 'startTime',
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'endTime',
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },

    {
      name: 'timeZone',
      type: 'text',
      defaultValue: 'America/New_York',
    },

    {
      name: 'relatedShow',
      type: 'relationship',
      relationTo: 'shows',
      admin: {
        description: 'Attach to a radio or TV show.',
      },
    },

    {
      name: 'relatedEpisode',
      type: 'relationship',
      relationTo: 'episodes',
      admin: {
        description: 'Optional — specific episode scheduled.',
      },
    },
  ],
}
