import type { CollectionConfig } from 'payload'
import { allowRoles, isAdmin, publicRead } from '@/access/control'
import { generateSlug } from '@/hooks/generateSlug'
import { SEOFields } from '@/fields/seo'
import { EnhancedAudioMetadata } from '@/fields/audioMetadata'
import { MusicLicensingFields } from '@/fields/musicLicensing'

export const Tracks: CollectionConfig = {
  slug: 'tracks',

  labels: {
    singular: 'Track',
    plural: 'Tracks',
  },

  admin: {
    group: 'Music',
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'artist',
      'genre',
      'bpm',
      'isExplicit',
      'staffPick',
      'featuredPriority',
    ],
    description:
      'Music tracks used for streaming, playlists, charts, radio programming, DJ tools, and metadata.',
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'host-dj', 'creator', 'admin']),
    update: allowRoles(['editor', 'host-dj', 'admin']),
    delete: isAdmin,
  },

  hooks: {
    beforeChange: [
      generateSlug,

      // Auto-sync Track BPM / Key / Explicit from media.audioMetadata
      async ({ data, req }) => {
        if (!data?.audioFile) return data

        try {
          const media = await req.payload.findByID({
            collection: 'media',
            id: data.audioFile,
          })

          const meta: any = media?.audioMetadata
          if (!meta) return data

          return {
            ...data,
            bpm: data.bpm ?? meta.bpm ?? null,
            key: data.key ?? meta.key ?? null,
            isExplicit: data.isExplicit !== undefined ? data.isExplicit : (meta.explicit ?? false),
          }
        } catch (err) {
          console.error('Audio metadata sync error:', err)
          return data
        }
      },
    ],
  },

  fields: [
    /* BASIC INFO ----------------------------------------- */
    { name: 'title', type: 'text', required: true },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { description: 'Auto-generated SEO-friendly URL.' },
    },

    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      label: 'Primary Artist',
    },

    {
      name: 'featuredArtists',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      label: 'Featured Artists',
    },

    { name: 'album', type: 'text' },

    /* IDENTIFIERS ----------------------------------------- */
    { name: 'isrc', type: 'text', label: 'ISRC Code' },
    { name: 'label', type: 'text', label: 'Record Label' },

    {
      name: 'writers',
      label: 'Songwriters',
      type: 'array',
      fields: [
        { name: 'writer', type: 'relationship', relationTo: 'profiles' },
        { name: 'percentage', type: 'number' },
      ],
    },

    /* AUDIO ------------------------------------------------ */
    {
      name: 'audioFile',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Audio Upload (WAV, MP3, AAC, FLAC)',
    },

    { name: 'streamUrl', type: 'text', label: 'Playback Stream URL (HLS / MP3)' },
    { name: 'previewUrl', type: 'text' },

    /* VIDEO SUPPORT ---------------------------------------- */
    {
      name: 'hasVideo',
      type: 'checkbox',
      defaultValue: false,
      label: 'Has Music Video?',
    },

    {
      name: 'video',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData.hasVideo === true,
      },
      fields: [
        { name: 'videoFile', type: 'upload', relationTo: 'media' },
        { name: 'hlsUrl', type: 'text' },
        { name: 'cloudflareId', type: 'text' },
        { name: 'verticalVideoFile', type: 'upload', relationTo: 'media' },
        { name: 'thumbnail', type: 'upload', relationTo: 'media' },
        { name: 'duration', type: 'number' },
        {
          name: 'qualityLevels',
          type: 'array',
          fields: [
            { name: 'quality', type: 'text' },
            { name: 'url', type: 'text' },
          ],
        },
      ],
    },

    /* CLASSIFICATION --------------------------------------- */
    {
      name: 'genre',
      type: 'relationship',
      relationTo: 'categories',
    },

    {
      name: 'mood',
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

    { name: 'bpm', type: 'number', label: 'BPM (auto-filled)' },
    { name: 'key', type: 'text', label: 'Musical Key (auto-filled)' },

    /* ARTWORK ---------------------------------------------- */
    {
      name: 'artwork',
      type: 'upload',
      relationTo: 'media',
    },

    /* CONTENT FLAGS ---------------------------------------- */
    {
      name: 'isExplicit',
      type: 'checkbox',
      defaultValue: false,
      label: 'Explicit?',
    },

    {
      name: 'radioEditAvailable',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'cleanAudioFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData.radioEditAvailable === true,
      },
    },

    /* ALGORITHM + DISCOVERY FIELDS ------------------------- */
    {
      name: 'publishDate',
      type: 'date',
      admin: {
        description: 'Used for freshness scoring and charting.',
      },
    },

    { name: 'isLocalArtist', type: 'checkbox', defaultValue: false },

    {
      name: 'chartPosition',
      type: 'number',
      admin: { description: 'Billboard / WaveNation chart position.' },
    },

    {
      name: 'staffPick',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Boosts recommendation scoring.',
      },
    },

    {
      name: 'featuredPriority',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Higher = higher placement in discovery.' },
    },

    /* METRICS (for AlgorithmSettings) ---------------------- */
    {
      name: 'metrics',
      type: 'group',
      fields: [
        { name: 'playCount', type: 'number', defaultValue: 0 },
        { name: 'videoPlayCount', type: 'number', defaultValue: 0 },
        { name: 'likes', type: 'number', defaultValue: 0 },
        { name: 'shareCount', type: 'number', defaultValue: 0 },
        { name: 'favorites', type: 'number', defaultValue: 0 },

        {
          name: 'completionRate',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Ratio of listens completed. Used in ranking and popularity.',
          },
        },

        {
          name: 'popularityScore',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Set by your algorithm resolver. Combines streams, likes, and social.',
          },
        },
      ],
    },

    /* SEO + EXTENDED METADATA ------------------------------ */
    SEOFields,
    EnhancedAudioMetadata,

    /* LICENSING ------------------------------------------- */
    MusicLicensingFields,

    /* INTERNAL NOTES --------------------------------------- */
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal programming notes.' },
    },
  ],
}

export default Tracks
