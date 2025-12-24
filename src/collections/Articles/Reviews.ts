import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   FIELD ACCESS WRAPPERS
   Field access MUST return boolean (not Where).
============================================================ */

const staffOnlyField = ({ req }: { req: unknown }): boolean =>
  Boolean(AccessControl.isStaff({ req } as any))

/* If you ever need "logged-in only" at field level */
const loggedInField = ({ req }: { req: unknown }): boolean =>
  Boolean(AccessControl.isLoggedIn({ req } as any))

/* ============================================================
   COLLECTION
============================================================ */

export const Reviews: CollectionConfig = {
  slug: 'reviews',

  admin: {
    useAsTitle: 'title',
    group: 'Engagement',
    defaultColumns: ['title', 'mediaType', 'rating', 'reviewer', 'status'],
  },

  /* --------------------------------------------------------
     COLLECTION ACCESS (AccessResult allowed here)
  -------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic, // 🔓 search-safe
    create: AccessControl.isLoggedIn,
    update: AccessControl.isStaff, // moderation-only updates (safe)
    delete: AccessControl.isStaff,
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
       REVIEW META
    -------------------------------------------------------- */
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
    },

    {
      name: 'criticRating',
      type: 'number',
      min: 1,
      max: 5,
      admin: { description: 'Optional critic rating (weighted)' },
    },

    {
      name: 'spoiler',
      type: 'checkbox',
      admin: { description: 'Mark review as containing spoilers' },
    },

    {
      name: 'body',
      type: 'richText',
    },

    /* --------------------------------------------------------
       INTERNAL MODERATION (STAFF ONLY)
       Field access must be boolean => use wrappers
    -------------------------------------------------------- */
    {
      name: 'editorNotes',
      type: 'richText',
      access: {
        read: staffOnlyField,
        create: staffOnlyField,
        update: staffOnlyField,
      },
      admin: {
        description: 'Internal-only editorial notes for moderation.',
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
    },

    /* --------------------------------------------------------
       REVIEWER
    -------------------------------------------------------- */
    {
      name: 'reviewer',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    /* --------------------------------------------------------
       MEDIA BEING REVIEWED
    -------------------------------------------------------- */
    {
      name: 'mediaType',
      type: 'select',
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
      required: true,
    },

    {
      name: 'mediaItem',
      type: 'relationship',
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
      required: true,
    },

    /* --------------------------------------------------------
       REACTIONS + COMMENTS (Threaded)
    -------------------------------------------------------- */
    {
      name: 'reactions',
      type: 'relationship',
      relationTo: 'review-reactions',
      hasMany: true,
    },

    {
      name: 'comments',
      type: 'relationship',
      relationTo: 'comments',
      hasMany: true,
    },

    /* --------------------------------------------------------
       AI TOXICITY (STAFF-ONLY READ)
    -------------------------------------------------------- */
    {
      name: 'toxicityScore',
      type: 'number',
      access: {
        read: staffOnlyField,
      },
      admin: {
        readOnly: true,
        description: 'AI toxicity score (0-1).',
      },
    },

    {
      name: 'isToxic',
      type: 'checkbox',
      defaultValue: false,
      access: {
        read: staffOnlyField,
      },
      admin: {
        readOnly: true,
        description: 'Automatically flagged if toxicity is high.',
      },
    },

    /* --------------------------------------------------------
       AUDIT (STAFF-ONLY READ)
    -------------------------------------------------------- */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      access: {
        read: staffOnlyField,
      },
      admin: { readOnly: true },
    },

    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      access: {
        read: staffOnlyField,
      },
      admin: { readOnly: true },
    },
  ],
}

export default Reviews
