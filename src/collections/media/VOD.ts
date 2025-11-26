// src/collections/media/VOD.ts
import type { CollectionConfig, PayloadRequest } from 'payload'
import { SEOFields } from '@/fields/seo'

/* ============================================================
   LOCAL HOOK WRAPPERS (Payload v3 compatible)
   These wrap your VOD hooks and ensure:
   ✔ correct typing
   ✔ server-only dynamic imports
   ✔ no ffmpeg bundling errors
============================================================ */

/** Extract video metadata before save */
const extractMetadataHook = async ({ data, req }: { data: any; req: PayloadRequest }) => {
  const file = data?.videoUpload || req.file
  if (!file) return data

  const filePath = file.tempFilePath || file.path || file.filepath || file.file || null

  if (!filePath) return data

  const { extractVODMetadata } = await import('@/hooks/vod/extractVODMetadata')
  const metadata = await extractVODMetadata(filePath)

  if (metadata?.format?.duration) {
    data.duration = metadata.format.duration
  }

  data.metadata = metadata
  return data
}

/** Generate thumbnails */
const thumbnailHook = async ({ doc }: { doc: any }) => {
  const { generateVODThumbnail } = await import('@/hooks/vod/generateVODThumbnail')
  await generateVODThumbnail(doc)
}

/** Generate preview sprite sheet + VTT */
const spriteHook = async ({ doc }: { doc: any }) => {
  const { generateVODPreviewSprites } = await import('@/hooks/vod/generateVODPreviewSprites')
  await generateVODPreviewSprites(doc)
}

/** Search index (after change) */
const indexSearchHook = async ({ doc }: { doc: any }) => {
  const { indexVODInSearchAfterChange } = await import('@/hooks/vod/indexVODInSearch')
  await indexVODInSearchAfterChange(doc)
}

/** Search index removal (after delete) */
const deleteSearchHook = async ({ doc }: { doc: any }) => {
  const { indexVODInSearchAfterDelete } = await import('@/hooks/vod/indexVODInSearch')
  await indexVODInSearchAfterDelete(doc)
}

/** Analytics update */
const analyticsHook = async ({ doc }: { doc: any }) => {
  const { updateVODAnalytics } = await import('@/hooks/vod/updateVODAnalytics')
  await updateVODAnalytics(doc)
}

/** Sync seasons + episodes */
const syncSeasonsHook = async (args: any) => {
  const { syncVODSeasonsAndEpisodes } = await import('@/hooks/vod/syncVODSeasonsAndEpisodes')
  return await syncVODSeasonsAndEpisodes(args)
}

/* ============================================================
   VOD COLLECTION
============================================================ */

export const VOD: CollectionConfig = {
  slug: 'vod',

  labels: {
    singular: 'VOD Item',
    plural: 'VOD Library',
  },

  admin: {
    useAsTitle: 'slug', // <— always exists, avoids errors
    group: 'On-Demand',
    defaultColumns: ['slug', 'type', 'isFree', 'status', 'createdAt', 'duration'],
  },

  access: {
    read: async ({ req, id }) => {
      const { protectPremiumVOD } = await import('@/hooks/vod/protectPremiumVOD')
      return protectPremiumVOD({ req, id })
    },
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  hooks: {
    beforeValidate: [syncSeasonsHook],
    beforeChange: [extractMetadataHook],
    afterChange: [thumbnailHook, spriteHook, indexSearchHook, analyticsHook],
    afterDelete: [deleteSearchHook],
  },

  fields: [
    /* ---------------------------------------------------------
       BASIC INFO
    --------------------------------------------------------- */
    {
      name: 'title',
      type: 'text',
      required: false, // leave optional so useAsTitle doesn't break your build
      admin: { description: 'Optional, not used as admin title' },
    },

    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },

    { name: 'description', type: 'textarea' },

    /* ---------------------------------------------------------
       VOD TYPE
    --------------------------------------------------------- */
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'movie',
      options: [
        { label: 'Movie', value: 'movie' },
        { label: 'Episode', value: 'episode' },
        { label: 'Clip / Short', value: 'clip' },
        { label: 'Music Video', value: 'music-video' },
        { label: 'Interview', value: 'interview' },
        { label: 'Live Performance', value: 'live' },
      ],
    },

    /* ---------------------------------------------------------
       SERIES / EPISODE LINK
    --------------------------------------------------------- */
    { name: 'series', type: 'relationship', relationTo: 'series' },

    {
      name: 'seasonNumber',
      type: 'number',
      admin: { condition: (data) => data?.type === 'episode' },
    },

    {
      name: 'episodeNumber',
      type: 'number',
      admin: { condition: (data) => data?.type === 'episode' },
    },

    /* ---------------------------------------------------------
       VIDEO SOURCE TYPE
    --------------------------------------------------------- */
    {
      name: 'videoType',
      type: 'select',
      required: true,
      defaultValue: 'cloudflare',
      options: [
        { label: 'Cloudflare Stream', value: 'cloudflare' },
        { label: 'Upload (R2)', value: 'upload' },
        { label: 'External URL', value: 'external' },
      ],
    },

    /* Cloudflare Stream ID */
    {
      name: 'cloudflareId',
      type: 'text',
      admin: { condition: (d) => d?.videoType === 'cloudflare' },
    },

    /* File Upload */
    {
      name: 'videoUpload',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (d) => d?.videoType === 'upload' },
    },

    /* External URL */
    {
      name: 'externalUrl',
      type: 'text',
      admin: { condition: (d) => d?.videoType === 'external' },
    },

    /* Thumbnail (required, can be autogenerated) */
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },

    /* Trailer */
    {
      name: 'trailer',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },

    /* Free vs Premium */
    {
      name: 'isFree',
      type: 'checkbox',
      defaultValue: false,
    },

    /* Categories / Tags */
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },

    { name: 'tags', type: 'text', hasMany: true },

    /* Genre list */
    {
      name: 'genre',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Drama', value: 'drama' },
        { label: 'Comedy', value: 'comedy' },
        { label: 'Talk', value: 'talk' },
        { label: 'Music', value: 'music' },
        { label: 'Lifestyle', value: 'lifestyle' },
        { label: 'News', value: 'news' },
        { label: 'Documentary', value: 'documentary' },
        { label: 'Reality', value: 'reality' },
      ],
    },

    /* Hosts & Cast */
    { name: 'hosts', type: 'relationship', relationTo: 'users', hasMany: true },
    { name: 'cast', type: 'relationship', relationTo: 'users', hasMany: true },

    /* Duration auto-filled */
    { name: 'duration', type: 'number' },

    /* Release date */
    { name: 'releaseDate', type: 'date' },

    /* Feed flags */
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'trending', type: 'checkbox', defaultValue: false },
    { name: 'recommended', type: 'checkbox', defaultValue: false },

    /* Publication status */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Archived', value: 'archived' },
      ],
    },

    /* Sprite sheet + VTT urls */
    { name: 'previewSpriteUrl', type: 'text' },
    { name: 'previewVttUrl', type: 'text' },

    /* Analytics group */
    {
      name: 'analytics',
      type: 'group',
      fields: [
        { name: 'views', type: 'number', defaultValue: 0 },
        { name: 'watchTime', type: 'number', defaultValue: 0 },
        { name: 'completions', type: 'number', defaultValue: 0 },
        { name: 'lastViewedAt', type: 'date' },
      ],
    },

    /* SEO */
    SEOFields,
  ],
}

export default VOD
