import type { CollectionConfig, Access, AccessArgs } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   ACCESS HELPERS
============================================================ */

const isLoggedIn: Access = ({ req }) => Boolean(req.user)

/**
 * Owner OR admin (collection-level, Payload-correct)
 */
const isOwnerOrAdmin: Access = async ({ req, id }: AccessArgs) => {
  if (!req.user) return false

  // 🔑 ADMIN ALWAYS WINS
  if (AccessControl.isAdmin({ req })) return true

  if (!id) return false

  const chart = await req.payload.findByID({
    collection: 'charts',
    id: String(id),
  })

  const ownerId =
    typeof chart.createdBy === 'string' ? chart.createdBy : (chart.createdBy as any)?.id

  return ownerId === String(req.user.id)
}

/* ============================================================
   COLLECTION
============================================================ */

export const Charts: CollectionConfig = {
  slug: 'charts',

  admin: {
    useAsTitle: 'title',
    group: 'Music',
    defaultColumns: ['title', 'chartType', 'period', 'status'],
  },

  access: {
    read: () => true,
    create: isLoggedIn,
    update: isOwnerOrAdmin, // ✅ FIX
    delete: AccessControl.isAdmin,
  },

  timestamps: true,

  fields: [
    /* ======================================================
       BASIC INFO
    ====================================================== */
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
    },

    {
      name: 'chartType',
      type: 'select',
      required: true,
      defaultValue: 'weekly',
      options: [
        { label: 'Weekly Chart', value: 'weekly' },
        { label: 'Daily Chart', value: 'daily' },
        { label: 'Monthly Chart', value: 'monthly' },
        { label: 'Trending', value: 'trending' },
        { label: 'Staff Picks', value: 'staff-picks' },
        { label: 'Algorithmic', value: 'algorithmic' },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'period',
          type: 'date',
          admin: {
            width: '50%',
            description: 'Week / Month this chart represents',
          },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'published',
          admin: { width: '50%' },
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' },
          ],
        },
      ],
    },

    {
      name: 'description',
      type: 'textarea',
    },

    /* ======================================================
       SPONSORSHIP
    ====================================================== */
    {
      name: 'sponsorship',
      type: 'group',
      label: 'Chart Sponsorship',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        {
          name: 'tier',
          type: 'select',
          defaultValue: 'accent',
          admin: { condition: (_, s) => s?.enabled },
          options: [
            { label: 'Flagship (Hero / #1)', value: 'flagship' },
            { label: 'Moment (Gainer / Drop)', value: 'moment' },
            { label: 'Accent (Subtle)', value: 'accent' },
          ],
        },
        {
          name: 'sponsorName',
          type: 'text',
          admin: { condition: (_, s) => s?.enabled },
        },
        {
          name: 'sponsorLogo',
          type: 'upload',
          relationTo: 'media',
          admin: { condition: (_, s) => s?.enabled },
        },
        {
          name: 'sponsorUrl',
          type: 'text',
          admin: { condition: (_, s) => s?.enabled },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'startDate',
              type: 'date',
              admin: { width: '50%', condition: (_, s) => s?.enabled },
            },
            {
              name: 'endDate',
              type: 'date',
              admin: { width: '50%', condition: (_, s) => s?.enabled },
            },
          ],
        },
        {
          name: 'disclosureText',
          type: 'text',
          defaultValue: 'Sponsored',
          admin: { condition: (_, s) => s?.enabled },
        },
      ],
    },

    /* ======================================================
       CHART ENTRIES
    ====================================================== */
    {
      name: 'entries',
      label: 'Chart Entries',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'rank', type: 'number', required: true },
            { name: 'lastWeek', type: 'number' },
            { name: 'peak', type: 'number' },
            { name: 'weeksOnChart', type: 'number' },
            {
              name: 'movement',
              type: 'select',
              options: [
                { label: 'Up', value: 'up' },
                { label: 'Down', value: 'down' },
                { label: 'New', value: 'new' },
                { label: 'Re-entry', value: 're-entry' },
                { label: 'No Change', value: 'same' },
              ],
            },
          ],
        },
        {
          name: 'track',
          type: 'relationship',
          relationTo: 'tracks',
        },
        {
          name: 'manualTrackInfo',
          type: 'group',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'artist', type: 'text' },
            {
              name: 'coverArt',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'externalUrl', type: 'text' },
          ],
        },
      ],
    },

    /* ======================================================
       OPTIONAL PLAYLIST LINK
    ====================================================== */
    {
      name: 'playlist',
      type: 'relationship',
      relationTo: 'playlists',
    },

    /* ======================================================
       AUDIT
    ====================================================== */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (!req.user) return data

        const userId = String(req.user.id)

        if (operation === 'create') {
          data.createdBy = userId
        }

        data.updatedBy = userId

        if (data.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }

        return data
      },
    ],
  },
}

export default Charts
