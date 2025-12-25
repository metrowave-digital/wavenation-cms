import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   OWNERSHIP HELPER (PAYLOAD SAFE)
============================================================ */

const isCommentAuthor = (req: any, doc: any): boolean => {
  if (!req?.user || !doc) return false

  const uid = String(req.user.id)
  const authorId = typeof doc.author === 'object' ? String(doc.author?.id) : String(doc.author)

  return uid === authorId
}

/* ============================================================
   BOOLEAN-ONLY API READ (FIELD SAFE)
============================================================ */

const publicFieldRead = (req: any): boolean => {
  if (req?.user) return true

  const apiKey = req?.headers?.get('x-api-key')
  const fetchCode = req?.headers?.get('x-fetch-code')

  if (!apiKey || !fetchCode) return false

  return apiKey === process.env.CMS_PUBLIC_API_KEY && fetchCode === process.env.PUBLIC_FETCH_CODE
}

/* ============================================================
   COLLECTION
============================================================ */

export const Comments: CollectionConfig = {
  slug: 'comments',

  admin: {
    useAsTitle: 'id',
    group: 'Engagement',
    defaultColumns: ['author', 'mediaType', 'status', 'createdAt'],
  },

  /* -----------------------------------------------------------
     COLLECTION ACCESS (AccessResult ALLOWED)
  ----------------------------------------------------------- */
  access: {
    read: ({ req }: any) => {
      if (req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.STAFF)) return true
      return AccessControl.isPublic({ req })
    },

    create: AccessControl.isLoggedIn,

    update: ({ req, doc }: any) => {
      if (AccessControl.isAdminRole(req)) return true
      if (AccessControl.hasRoleAtOrAbove(req, Roles.STAFF)) return true
      return isCommentAuthor(req, doc)
    },

    delete: ({ req, doc }: any) => {
      if (AccessControl.isAdminRole(req)) return true
      return isCommentAuthor(req, doc)
    },
  },

  timestamps: true,

  /* -----------------------------------------------------------
     FIELDS
  ----------------------------------------------------------- */
  fields: [
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: { readOnly: true },
    },

    {
      name: 'body',
      type: 'richText',
      required: true,
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Flagged', value: 'flagged' },
        { label: 'Removed', value: 'removed' },
      ],
      access: {
        read: AccessControl.isStaffAccessField,
        update: AccessControl.isStaffAccessField,
      },
    },

    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'comments',
      admin: { description: 'Threaded comment support' },
    },

    {
      name: 'mediaType',
      type: 'select',
      required: true,
      options: [
        'tracks',
        'albums',
        'podcasts',
        'podcast-episodes',
        'vod',
        'films',
        'shows',
        'episodes',
        'articles',
        'reviews',
      ].map((m) => ({ label: m, value: m })),
    },

    {
      name: 'mediaItem',
      type: 'relationship',
      relationTo: [
        'tracks',
        'albums',
        'podcasts',
        'podcast-episodes',
        'vod',
        'films',
        'shows',
        'episodes',
        'articles',
        'reviews',
      ],
      required: true,
    },

    {
      name: 'reactions',
      type: 'relationship',
      relationTo: 'comment-reactions',
      hasMany: true,
      access: {
        read: ({ req }: any): boolean => publicFieldRead(req),
      },
    },

    {
      name: 'toxicityScore',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'AI-generated toxicity score (0–1).',
      },
      access: {
        read: AccessControl.isStaffAccessField,
      },
    },

    {
      name: 'isToxic',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        description: 'Automatically flagged when toxicity exceeds threshold.',
      },
      access: {
        read: AccessControl.isStaffAccessField,
      },
    },
  ],

  /* -----------------------------------------------------------
     HOOKS
  ----------------------------------------------------------- */
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create' && req?.user) {
          data.author = req.user.id
          data.status = 'pending'
        }
        return data
      },
    ],
  },
}

export default Comments
