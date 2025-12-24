// src/collections/ArtistSpotlight.ts
import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

const ArtistSpotlight: CollectionConfig = {
  slug: 'artist-spotlight',

  labels: {
    singular: 'Artist Spotlight',
    plural: 'Artist Spotlights',
  },

  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'artist', 'featuredArticle'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL
     - Public read (search + frontend safe)
     - Staff create/update
     - Admin delete
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic,
    create: AccessControl.isStaff,
    update: AccessControl.isStaff,
    delete: AccessControl.isAdmin,
  },

  fields: [
    /* ---------------- TITLE ---------------- */
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    /* ---------------- BANNER IMAGE ---------------- */
    {
      name: 'bannerImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    /* ---------------- ARTIST ---------------- */
    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    /* ---------------- ARTIST IMAGE OVERRIDE ---------------- */
    {
      name: 'artistImage',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'tagline',
      type: 'text',
    },

    {
      name: 'extraInfo',
      type: 'textarea',
    },

    /* ---------------- FEATURED CONTENT ---------------- */
    {
      name: 'featuredArticle',
      type: 'relationship',
      relationTo: 'articles',
    },

    {
      name: 'featuredRelease',
      type: 'relationship',
      relationTo: 'albums',
    },

    /* ---------------- SLUG ---------------- */
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title if left blank.',
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.title && !data.slug) {
              data.slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            }
            return data
          },
        ],
      },
    },

    /* ---------------- AUDIT ---------------- */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (!req.user) return data

        if (operation === 'create') {
          data.createdBy = req.user.id
        }
        data.updatedBy = req.user.id

        return data
      },
    ],
  },
}

export default ArtistSpotlight
