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
     🔑 Public read is REQUIRED for search
     ✍🏽 Write access restricted to staff/admin
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic, // 🔓 search-safe
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

    /* ---------------- ARTIST RELATIONSHIP ---------------- */
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

    /* ---------------- FEATURED ARTICLE ---------------- */
    {
      name: 'featuredArticle',
      type: 'relationship',
      relationTo: 'articles',
    },

    /* ---------------- FEATURED RELEASE ---------------- */
    {
      name: 'featuredRelease',
      type: 'relationship',
      relationTo: 'albums',
    },

    /* ---------------- SLUG ---------------- */
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.title && !data.slug) {
              data.slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            }
          },
        ],
      },
    },
  ],
}

export default ArtistSpotlight
