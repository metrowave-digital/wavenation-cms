import type { CollectionConfig } from 'payload'
import { generateSlug } from '@/hooks/generateSlug'
import { allowRoles, isAdmin, publicRead } from '@/access/control'
import { SEOFields } from '@/fields/seo'
import { MusicLicensingFields } from '@/fields/musicLicensing'

export const Episodes: CollectionConfig = {
  slug: 'episodes',

  labels: {
    singular: 'Episode',
    plural: 'Episodes',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Video',
    defaultColumns: [
      'title',
      'show',
      'episodeNumber',
      'seasonNumber',
      'status',
      'staffPick',
      'featuredPriority',
    ],
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'creator', 'admin']),
    update: allowRoles(['editor', 'creator', 'admin']),
    delete: isAdmin,
  },

  hooks: {
    beforeChange: [
      generateSlug,

      // Sync metadata from media
      async ({ data, req }) => {
        let updated = { ...data }

        /* -----------------------------
         * SYNC VIDEO METADATA
         * ----------------------------- */
        if (data.videoMedia) {
          try {
            const media = await req.payload.findByID({
              collection: 'media',
              id: data.videoMedia,
            })

            const meta: any = media?.videoMetadata

            if (meta) {
              updated.duration ??= meta.duration ?? null
              updated.isExplicit ??= meta.explicit ?? false
              updated.transcript ??= meta.transcript ?? null
            }
          } catch (err) {
            console.error('Episode video metadata sync error:', err)
          }
        }

        /* -----------------------------
         * SYNC AUDIO METADATA
         * ----------------------------- */
        if (data.audioMedia) {
          try {
            const media = await req.payload.findByID({
              collection: 'media',
              id: data.audioMedia,
            })

            const meta: any = media?.audioMetadata

            if (meta) {
              updated.duration ??= meta.duration ?? null
              updated.isExplicit ??= meta.explicit ?? false
              updated.transcript ??= meta.transcript ?? null
            }
          } catch (err) {
            console.error('Episode audio metadata sync error:', err)
          }
        }

        return updated
      },
    ],
  },

  fields: [
    /* BASIC INFO ------------------------------------------------------ */
    { name: 'title', type: 'text', required: true },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { description: 'Auto-generated for SEO and URLs.' },
    },

    {
      name: 'show',
      type: 'relationship',
      relationTo: 'shows',
      required: true,
    },

    {
      name: 'series',
      type: 'relationship',
      relationTo: 'series',
    },

    { name: 'seasonNumber', type: 'number' },
    { name: 'episodeNumber', type: 'number' },

    /* STATUS ---------------------------------------------------------- */
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
      name: 'synopsis',
      type: 'richText',
    },

    /* MEDIA ----------------------------------------------------------- */
    {
      name: 'videoMedia',
      label: 'Primary Video',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Main episode video file.' },
    },

    {
      name: 'audioMedia',
      label: 'Alternate Audio',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional alternative audio version.' },
    },

    {
      name: 'duration',
      type: 'number',
      admin: { description: 'Auto-filled from media metadata.' },
    },

    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },

    /* CONTENT FLAGS --------------------------------------------------- */
    {
      name: 'isExplicit',
      type: 'checkbox',
      defaultValue: false,
      label: 'Explicit?',
    },

    {
      name: 'transcript',
      type: 'textarea',
      admin: { description: 'Auto-filled when transcription is enabled.' },
    },

    /* AVAILABILITY WINDOW -------------------------------------------- */
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
            { label: 'Apple TV', value: 'apple-tv' },
            { label: 'Roku', value: 'roku' },
            { label: 'Fire TV', value: 'fire-tv' },
          ],
        },

        {
          name: 'countryRestrictions',
          type: 'array',
          fields: [{ name: 'country', type: 'text' }],
        },
      ],
    },

    /* AGE RATINGS ----------------------------------------------------- */
    {
      name: 'ageRatings',
      type: 'group',
      fields: [
        {
          name: 'mpaa',
          type: 'select',
          options: ['G', 'PG', 'PG-13', 'R', 'NC-17'].map((r) => ({
            label: r,
            value: r,
          })),
        },
        {
          name: 'tvRating',
          type: 'select',
          options: ['TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'].map((v) => ({
            label: v,
            value: v,
          })),
        },
        {
          name: 'contentWarnings',
          type: 'array',
          fields: [{ name: 'warning', type: 'text' }],
        },
      ],
    },

    /* TAGGING ---------------------------------------------------------- */
    {
      name: 'featuredProfiles',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
    },

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

    /* DISCOVERY / ALGORITHM FIELDS ------------------------------------ */
    {
      name: 'staffPick',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Boosts this episode in algorithms.' },
    },

    {
      name: 'featuredPriority',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Higher = appears earlier in discovery.' },
    },

    /* ANALYTICS -------------------------------------------------------- */
    {
      name: 'metrics',
      type: 'group',
      fields: [
        { name: 'views', type: 'number', defaultValue: 0 },
        { name: 'likes', type: 'number', defaultValue: 0 },
        { name: 'shares', type: 'number', defaultValue: 0 },
        { name: 'completions', type: 'number', defaultValue: 0 },
        {
          name: 'completionRate',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Auto-calculated by recommendation engine: completions ÷ views.',
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

    /* SEO + LICENSING -------------------------------------------------- */
    SEOFields,
    MusicLicensingFields,
  ],
}

export default Episodes
