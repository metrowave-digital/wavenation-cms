import type { CollectionConfig, Access, FieldAccess } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   FIELD ACCESS (BOOLEAN ONLY — PAYLOAD SAFE)
============================================================ */

const staffOnlyField: FieldAccess = ({ req }) =>
  Boolean(req?.user && AccessControl.isStaff({ req }))

/* ============================================================
   COLLECTION ACCESS
============================================================ */

/**
 * Update allowed if:
 * - Staff / Admin
 * - OR owner of the review
 */
const canUpdateReview: Access = ({ req, id }) => {
  if (!req?.user) return false

  // Staff override
  if (AccessControl.isStaff({ req })) return true

  if (!id) return false

  // Owner-only update
  return {
    id: { equals: id },
    createdBy: { equals: req.user.id },
  }
}

/* ============================================================
   COLLECTION
============================================================ */

const Reviews: CollectionConfig = {
  slug: 'reviews',

  admin: {
    useAsTitle: 'title',
    group: 'Engagement',
    defaultColumns: ['title', 'mediaType', 'rating', 'reviewer', 'status'],
  },

  access: {
    read: AccessControl.isPublic, // 🔓 frontend & search safe
    create: AccessControl.isLoggedIn, // authenticated users
    update: canUpdateReview, // owner OR staff
    delete: AccessControl.isStaff, // moderation-only delete
  },

  timestamps: true,

  fields: [
    /* ========================================================
       REVIEW CORE
    ======================================================== */

    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      required: true,
      admin: {
        description: 'User rating (1–5).',
      },
    },

    {
      name: 'criticRating',
      type: 'number',
      min: 1,
      max: 5,
      admin: {
        description: 'Optional editorial/critic rating.',
      },
    },

    {
      name: 'spoiler',
      type: 'checkbox',
      admin: {
        description: 'Mark review as containing spoilers.',
      },
    },

    {
      name: 'body',
      type: 'richText',
      admin: {
        description: 'Full review text.',
      },
    },

    /* ========================================================
       INTERNAL MODERATION (STAFF ONLY)
    ======================================================== */

    {
      name: 'editorNotes',
      type: 'richText',
      access: {
        read: staffOnlyField,
        create: staffOnlyField,
        update: staffOnlyField,
      },
      admin: {
        description: 'Internal moderation or editorial notes.',
      },
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'approved',
      options: [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Flagged', value: 'flagged' },
        { label: 'Removed', value: 'removed' },
      ],
      access: {
        update: staffOnlyField,
      },
      admin: {
        description: 'Moderation status.',
      },
    },

    /* ========================================================
       REVIEWER
    ======================================================== */

    {
      name: 'reviewer',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    /* ========================================================
       MEDIA BEING REVIEWED
    ======================================================== */

    {
      name: 'mediaType',
      type: 'select',
      required: true,
      options: [
        'tracks',
        'albums',
        'films',
        'vod',
        'podcasts',
        'podcast-episodes',
        'shows',
        'episodes',
        'articles',
      ].map((t) => ({ label: t, value: t })),
    },

    {
      name: 'mediaItem',
      type: 'relationship',
      required: true,
      relationTo: [
        'tracks',
        'albums',
        'films',
        'vod',
        'podcasts',
        'podcast-episodes',
        'shows',
        'episodes',
        'articles',
      ],
    },

    /* ========================================================
       AI / MODERATION (FUTURE-READY)
       Safe optional fields — no migration impact
    ======================================================== */

    {
      name: 'toxicityScore',
      type: 'number',
      admin: { readOnly: true },
      access: { read: staffOnlyField },
    },

    {
      name: 'isToxic',
      type: 'checkbox',
      defaultValue: false,
      admin: { readOnly: true },
      access: { read: staffOnlyField },
    },

    /* ========================================================
       SEARCH / FEED SUPPORT
       (Lightweight read-model helpers)
    ======================================================== */

    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Optional excerpt for feeds/search.',
      },
    },

    /* ========================================================
       AUDIT
    ======================================================== */

    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
      access: { read: staffOnlyField },
    },

    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
      access: { read: staffOnlyField },
    },
  ],

  /* ============================================================
     HOOKS — AUDIT
  ============================================================ */

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (!req?.user) return data

        if (operation === 'create') {
          data.createdBy = req.user.id
        }

        data.updatedBy = req.user.id

        return data
      },
    ],
  },
}

export default Reviews
