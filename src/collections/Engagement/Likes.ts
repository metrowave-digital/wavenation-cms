// src/collections/Engagement/Likes.ts

import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   OWNERSHIP HELPER
============================================================ */

const isLikeOwner = (req: any, doc: any): boolean => {
  if (!req?.user || !doc) return false

  const uid = String(req.user.id)
  const likeUserId = typeof doc.user === 'object' ? String(doc.user?.id) : String(doc.user)

  return uid === likeUserId
}

/* ============================================================
   BOOLEAN-ONLY PUBLIC READ
============================================================ */

const publicRead = (req: any): boolean => {
  if (req?.user) return true

  const apiKey = req?.headers?.get('x-api-key')
  const fetchCode = req?.headers?.get('x-fetch-code')

  if (!apiKey || !fetchCode) return false

  return apiKey === process.env.CMS_PUBLIC_API_KEY && fetchCode === process.env.PUBLIC_FETCH_CODE
}

/* ============================================================
   COLLECTION
============================================================ */

export const Likes: CollectionConfig = {
  slug: 'likes',

  admin: {
    useAsTitle: 'id',
    group: 'Engagement',
    defaultColumns: ['user', 'mediaType', 'createdAt'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL
  ----------------------------------------------------------- */
  access: {
    read: ({ req }: any) => publicRead(req),

    /**
     * Prevent duplicate likes
     * Safe against undefined data (admin preflight)
     */
    create: async ({ req, data }) => {
      // Must be logged in
      if (!req?.user) return false

      // Payload may call access without data
      if (!data?.mediaType || !data?.mediaItem) {
        return true
      }

      const existing = await req.payload.find({
        collection: 'likes',
        where: {
          and: [
            { user: { equals: req.user.id } },
            { mediaType: { equals: data.mediaType } },
            { mediaItem: { equals: data.mediaItem } },
          ],
        },
        limit: 1,
      })

      return existing.totalDocs === 0
    },

    update: () => false,

    delete: ({ req, doc }: any) => {
      if (AccessControl.isAdminRole(req)) return true
      return isLikeOwner(req, doc)
    },
  },

  timestamps: true,

  /* -----------------------------------------------------------
     FIELDS
  ----------------------------------------------------------- */
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: { readOnly: true },
    },

    {
      name: 'mediaType',
      type: 'select',
      required: true,
      options: [
        'tracks',
        'albums',
        'films',
        'podcasts',
        'podcast-episodes',
        'shows',
        'episodes',
        'vod',
        'articles',
        'reviews',
        'comments',
        'playlists',
      ].map((x) => ({ label: x, value: x })),
    },

    {
      name: 'mediaItem',
      type: 'relationship',
      relationTo: [
        'tracks',
        'albums',
        'films',
        'podcasts',
        'podcast-episodes',
        'shows',
        'episodes',
        'vod',
        'articles',
        'reviews',
        'comments',
        'playlists',
      ],
      required: true,
    },

    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],

  /* -----------------------------------------------------------
     HOOKS
  ----------------------------------------------------------- */
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && req?.user) {
          data.user = req.user.id
          data.createdBy = req.user.id
        }
        return data
      },
    ],
  },
}

export default Likes
