import type { CollectionConfig } from 'payload'
import { generateSlug } from '@/hooks/generateSlug'
import { allowRoles, isAdmin, publicRead } from '@/access/control'
import { SEOFields } from '@/fields/seo'
import { MusicLicensingFields } from '@/fields/musicLicensing'

export const PodcastEpisodes: CollectionConfig = {
  slug: 'podcast-episodes',

  labels: {
    singular: 'Podcast Episode',
    plural: 'Podcast Episodes',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Audio',
    defaultColumns: [
      'title',
      'podcast',
      'episodeNumber',
      'seasonNumber',
      'status',
      'staffPick',
      'featuredPriority',
    ],
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'creator', 'host-dj', 'admin']),
    update: allowRoles(['editor', 'creator', 'host-dj', 'admin']),
    delete: isAdmin,
  },

  hooks: {
    beforeChange: [
      generateSlug,

      // Auto-sync from audio metadata
      async ({ data, req }) => {
        if (!data?.audioMedia) return data

        try {
          const media = await req.payload.findByID({
            collection: 'media',
            id: data.audioMedia,
          })

          const meta: any = media?.audioMetadata
          if (!meta) return data

          return {
            ...data,
            duration: data.duration ?? meta.duration ?? null,
            isExplicit: data.isExplicit !== undefined ? data.isExplicit : (meta.explicit ?? false),
            transcript: data.transcript ?? meta.transcript ?? null,
          }
        } catch (err) {
          console.error('Podcast episode audio metadata sync error:', err)
          return data
        }
      },
    ],
  },

  fields: [
    /* BASIC ---------------------------------------------------- */
    { name: 'title', type: 'text', required: true },

    { name: 'slug', type: 'text', unique: true },

    {
      name: 'podcast',
      type: 'relationship',
      relationTo: 'podcasts',
      required: true,
    },

    { name: 'episodeNumber', type: 'number' },
    { name: 'seasonNumber', type: 'number' },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },

    { name: 'publishDate', type: 'date' },

    {
      name: 'description',
      type: 'richText',
    },

    /* AUDIO ---------------------------------------------------- */
    {
      name: 'audioMedia',
      label: 'Episode Audio',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'duration',
      type: 'number',
      label: 'Duration (seconds)',
      admin: { description: 'Auto-filled from media metadata.' },
    },

    {
      name: 'isExplicit',
      type: 'checkbox',
      defaultValue: false,
      label: 'Explicit?',
    },

    {
      name: 'transcript',
      type: 'textarea',
      admin: {
        description: 'Auto-filled from transcription when available.',
      },
    },

    /* AVAILABILITY --------------------------------------------- */
    {
      name: 'availability',
      type: 'group',
      fields: [
        { name: 'availableFrom', type: 'date' },
        { name: 'availableUntil', type: 'date' },

        {
          name: 'platforms',
          type: 'select',
          hasMany: true,
          admin: { description: 'Platforms where this episode is available.' },
          options: [
            { label: 'Web', value: 'web' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Apple Podcasts', value: 'apple' },
            { label: 'Spotify', value: 'spotify' },
            { label: 'Google Podcasts', value: 'google' },
          ],
        },

        {
          name: 'countryRestrictions',
          type: 'array',
          fields: [{ name: 'country', type: 'text' }],
        },
      ],
    },

    /* AGE RATING (Podcast Standards) --------------------------- */
    {
      name: 'ageRatings',
      type: 'group',
      fields: [
        {
          name: 'contentRating',
          type: 'select',
          admin: { description: 'Apple + Spotify content rating.' },
          options: [
            { label: 'Clean', value: 'clean' },
            { label: 'Explicit', value: 'explicit' },
          ],
        },
        {
          name: 'contentWarnings',
          type: 'array',
          fields: [{ name: 'warning', type: 'text' }],
        },
      ],
    },

    /* HOSTS / GUESTS ------------------------------------------- */
    {
      name: 'hostProfiles',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
    },

    {
      name: 'guestProfiles',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
    },

    /* TAGGING -------------------------------------------------- */
    {
      name: 'genres',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },

    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },

    /* DISCOVERY ----------------------------------------------- */
    {
      name: 'staffPick',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Boosts ranking in recommendations.' },
    },

    {
      name: 'featuredPriority',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Higher = appears more prominently in discovery.',
      },
    },

    /* ANALYTICS ------------------------------------------------ */
    {
      name: 'metrics',
      type: 'group',
      fields: [
        { name: 'plays', type: 'number', defaultValue: 0 },
        { name: 'downloads', type: 'number', defaultValue: 0 },
        { name: 'likes', type: 'number', defaultValue: 0 },
        { name: 'shares', type: 'number', defaultValue: 0 },
        { name: 'completions', type: 'number', defaultValue: 0 },
        {
          name: 'completionRate',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Auto-calculated by recommendation engine: completions ÷ plays.',
          },
        },
        {
          name: 'popularityScore',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'Set by algorithm resolver.' },
        },
      ],
    },

    /* SEO + LICENSING ----------------------------------------- */
    SEOFields,
    MusicLicensingFields,
  ],
}

export default PodcastEpisodes
