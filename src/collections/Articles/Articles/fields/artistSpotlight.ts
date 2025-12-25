import type { CollectionConfig, Access } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   ACCESS HELPERS
============================================================ */

const canUpdateSpotlight: Access = ({ req, id }) => {
  if (!req?.user) return false

  // 🔑 Staff / Admin override
  if (AccessControl.isStaff({ req }) || AccessControl.isAdminRole(req)) {
    return true
  }

  if (!id) return false

  // 👤 Owner-only update
  return {
    id: { equals: id },
    createdBy: { equals: req.user.id },
  }
}

const canDeleteSpotlight: Access = ({ req, id }) => {
  if (!req?.user) return false

  // 🔑 Admin override only
  if (AccessControl.isAdminRole(req)) {
    return true
  }

  if (!id) return false

  // 👤 Owner-only delete
  return {
    id: { equals: id },
    createdBy: { equals: req.user.id },
  }
}

/* ============================================================
   COLLECTION
============================================================ */

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
     ACCESS
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic,
    create: AccessControl.isCreator,
    update: canUpdateSpotlight,
    delete: canDeleteSpotlight,
  },

  /* -----------------------------------------------------------
     FIELDS
  ----------------------------------------------------------- */
  fields: [
    /* ================= BASIC ================= */

    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'bannerImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

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

    /* ================= FEATURE FLAGS ================= */

    {
      type: 'group',
      name: 'featureFlags',
      label: 'Feature & Placement',
      admin: {
        position: 'sidebar',
        description: 'Controls where this Artist Spotlight appears.',
      },
      fields: [
        {
          type: 'checkbox',
          name: 'isFeatured',
          label: 'Featured (Global)',
          defaultValue: false,
        },
        {
          type: 'checkbox',
          name: 'featureOnHomepage',
          label: 'Feature on Homepage',
          defaultValue: false,
        },
        {
          type: 'checkbox',
          name: 'featureInMenu',
          label: 'Feature in Menu / Navigation',
          defaultValue: false,
        },
        {
          type: 'checkbox',
          name: 'featureOnArtistPage',
          label: 'Feature on Artist Page',
          defaultValue: true,
        },
        {
          type: 'checkbox',
          name: 'featureInCarousel',
          label: 'Feature in Carousel / Slider',
          defaultValue: false,
        },
      ],
    },

    /* ================= FEATURE BANNER ================= */

    {
      type: 'group',
      name: 'featureBanner',
      label: 'Feature Banner Settings',
      admin: {
        position: 'sidebar',
        condition: (_, data) => data?.featureFlags?.isFeatured === true,
      },
      fields: [
        {
          type: 'upload',
          name: 'bannerImageOverride',
          relationTo: 'media',
          label: 'Banner Image Override',
        },
        {
          type: 'text',
          name: 'bannerHeadline',
          label: 'Banner Headline',
        },
        {
          type: 'text',
          name: 'bannerSubheadline',
          label: 'Banner Subheadline',
        },
      ],
    },

    /* ================= FEATURE SCHEDULING ================= */

    {
      type: 'group',
      name: 'featureSchedule',
      label: 'Feature Schedule',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          type: 'date',
          name: 'featureStart',
          label: 'Feature Start Date',
        },
        {
          type: 'date',
          name: 'featureEnd',
          label: 'Feature End Date',
        },
      ],
    },

    /* ================= FEATURE ORDERING ================= */

    {
      type: 'number',
      name: 'featurePriority',
      label: 'Feature Priority',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first (1 = highest).',
      },
    },

    {
      type: 'textarea',
      name: 'featureNotes',
      label: 'Feature Notes (Internal)',
      admin: {
        position: 'sidebar',
      },
    },

    /* ================= SLUG ================= */

    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title if left blank.',
      },
    },

    /* ================= AUDIT ================= */

    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },

    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],

  /* -----------------------------------------------------------
     HOOKS
  ----------------------------------------------------------- */
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        if (data.slug || !data.title) return data

        data.slug = data.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')

        return data
      },
    ],

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

export default ArtistSpotlight
