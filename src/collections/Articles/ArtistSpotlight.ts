// src/collections/ArtistSpotlight.ts
import { CollectionConfig } from 'payload'

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
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    /* Banner Image */
    {
      name: 'bannerImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    /* Artist Relationship */
    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    /* Artist Image Override (optional) */
    {
      name: 'artistImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },

    {
      name: 'tagline',
      type: 'text',
    },

    {
      name: 'extraInfo',
      type: 'textarea',
    },

    /* Featured Article */
    {
      name: 'featuredArticle',
      type: 'relationship',
      relationTo: 'articles',
      required: false,
    },

    /* Featured Release */
    {
      name: 'featuredRelease',
      type: 'relationship',
      relationTo: 'albums',
      required: false,
    },

    /* Slug */
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
