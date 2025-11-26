import type { CollectionConfig } from 'payload'
import { generateSlug } from '@/hooks/generateSlug'
import { populateMediaMetadata } from '@/hooks/media'
import { allowRoles, isAdmin, publicRead } from '@/access/control'
import { SEOFields } from '@/fields/seo'

// Unified metadata schemas
import { EnhancedAudioMetadata } from '@/fields/audioMetadata'
import { EnhancedVideoMetadata } from '@/fields/videoMetadata'

export const Media: CollectionConfig = {
  slug: 'media',

  admin: {
    useAsTitle: 'filename',
    group: 'Assets',
    defaultColumns: ['filename', 'type', 'folder', 'mimeType', 'updatedAt'],
    description: 'All images, videos, audio files, documents, and brand assets.',
  },

  access: {
    read: publicRead,
    create: allowRoles(['creator', 'contributor', 'editor', 'host-dj', 'admin']),
    update: allowRoles(['editor', 'admin']),
    delete: isAdmin,
  },

  upload: {
    mimeTypes: [
      'image/*',
      'video/*',
      'audio/*',
      'application/pdf',
      'application/zip',
      'application/json',
    ],

    imageSizes: [
      { name: 'thumbnail', width: 300, height: 300 },
      { name: 'medium', width: 800 },
      { name: 'large', width: 1600 },
      { name: 'square', width: 800, height: 800 },
      { name: 'hero', width: 1920, height: 1080 },
      { name: 'portrait', width: 1080, height: 1600 },
    ],

    adminThumbnail: 'thumbnail',
  },

  hooks: {
    beforeChange: [
      populateMediaMetadata,
      generateSlug,
      ({ req, data }) => {
        if (req.user?.id) {
          return { ...data, uploadedBy: req.user.id }
        }
        return data
      },
    ],
  },

  fields: [
    /* -------------------------------------------
     * BASIC INFO
     * ------------------------------------------- */
    { name: 'title', type: 'text', admin: { description: 'Optional display name.' } },
    { name: 'filename', type: 'text', admin: { readOnly: true } },
    { name: 'slug', type: 'text', unique: true },
    { name: 'mimeType', type: 'text', admin: { readOnly: true } },

    /* -------------------------------------------
     * MEDIA TYPE
     * ------------------------------------------- */
    {
      name: 'type',
      type: 'select',
      required: true,
      admin: { readOnly: true },
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Audio', value: 'audio' },
        { label: 'Video', value: 'video' },
        { label: 'Document', value: 'document' },
        { label: 'Other', value: 'other' },
      ],
    },

    /* -------------------------------------------
     * OTT / PLATFORM AVAILABILITY
     * ------------------------------------------- */
    {
      name: 'platformAvailability',
      label: 'Available On',
      type: 'select',
      hasMany: true,
      defaultValue: ['web'],
      options: [
        { label: 'Web', value: 'web' },
        { label: 'Mobile App', value: 'mobile' },
        { label: 'Apple TV', value: 'apple_tv' },
        { label: 'Roku', value: 'roku' },
        { label: 'Fire TV', value: 'fire_tv' },
      ],
    },

    /* -------------------------------------------
     * AVAILABILITY WINDOWS
     * ------------------------------------------- */
    {
      name: 'availability',
      label: 'Availability Window',
      type: 'group',
      fields: [
        { name: 'availableFrom', type: 'date' },
        { name: 'availableUntil', type: 'date' },
        {
          name: 'countryRestrictions',
          type: 'array',
          fields: [{ name: 'country', type: 'text' }],
        },
      ],
    },

    /* -------------------------------------------
     * AGE RATING (TV/Film/Video Content)
     * ------------------------------------------- */
    {
      name: 'ageRating',
      label: 'Age Rating',
      type: 'group',
      fields: [
        {
          name: 'tvRating',
          type: 'select',
          options: ['TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'].map((r) => ({
            value: r,
            label: r,
          })),
        },
        {
          name: 'movieRating',
          type: 'select',
          options: ['G', 'PG', 'PG-13', 'R', 'NC-17'].map((r) => ({ value: r, label: r })),
        },
        {
          name: 'contentWarnings',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Violence', value: 'violence' },
            { label: 'Nudity', value: 'nudity' },
            { label: 'Strong Language', value: 'language' },
            { label: 'Substance Use', value: 'substance' },
            { label: 'Flashing Lights', value: 'flashing' },
            { label: 'Mature Themes', value: 'mature' },
          ],
        },
      ],
    },

    /* -------------------------------------------
     * VIRTUAL FOLDER SYSTEM
     * ------------------------------------------- */
    {
      name: 'folder',
      label: 'Media Folder',
      type: 'select',
      defaultValue: 'uncategorized',
      options: [
        { label: 'Artists', value: 'artists' },
        { label: 'Shows', value: 'shows' },
        { label: 'Series', value: 'series' },
        { label: 'Seasons', value: 'seasons' },
        { label: 'Episodes', value: 'episodes' },
        { label: 'Films', value: 'films' },
        { label: 'Events', value: 'events' },
        { label: 'Ads', value: 'ads' },
        { label: 'Brand Assets', value: 'brand-assets' },
        { label: 'Playlists', value: 'playlists' },
        { label: 'Hosts & DJs', value: 'dj-hosts' },
        { label: 'Radio Programming', value: 'radio' },
        { label: 'TV Programming', value: 'tv' },
        { label: 'Press / Marketing', value: 'press' },
        { label: 'Community', value: 'community' },
        { label: 'Uncategorized', value: 'uncategorized' },
      ],
    },

    /* -------------------------------------------
     * LINKED CONTENT
     * ------------------------------------------- */
    {
      name: 'linkedContent',
      label: 'Associated With',
      type: 'group',
      fields: [
        { name: 'artist', type: 'relationship', relationTo: 'profiles' },
        { name: 'show', type: 'relationship', relationTo: 'shows' },
        { name: 'series', type: 'relationship', relationTo: 'series' },
        { name: 'season', type: 'relationship', relationTo: 'seasons' },
        { name: 'episode', type: 'relationship', relationTo: 'episodes' },
        { name: 'film', type: 'relationship', relationTo: 'films' },
        { name: 'event', type: 'relationship', relationTo: 'events' },
      ],
    },

    /* -------------------------------------------
     * VIDEO METADATA (FULL v2)
     * ------------------------------------------- */
    EnhancedVideoMetadata,

    /* -------------------------------------------
     * AUDIO METADATA (FULL v2)
     * ------------------------------------------- */
    EnhancedAudioMetadata,

    /* -------------------------------------------
     * IMAGE METADATA
     * ------------------------------------------- */
    {
      name: 'alt',
      type: 'text',
      admin: { condition: (_, data) => data?.type === 'image' },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { condition: (_, data) => data?.type === 'image' },
    },
    {
      name: 'focalPoint',
      type: 'point',
      admin: { condition: (_, data) => data?.type === 'image' },
    },

    /* -------------------------------------------
     * OWNERSHIP / RIGHTS
     * ------------------------------------------- */
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
    { name: 'copyright', type: 'textarea' },

    {
      name: 'usageRights',
      type: 'select',
      defaultValue: 'owned',
      options: [
        { label: 'Owned by WaveNation', value: 'owned' },
        { label: 'Licensed', value: 'licensed' },
        { label: 'Permission Granted', value: 'permission' },
        { label: 'Fair Use', value: 'fair-use' },
        { label: 'User Generated Content', value: 'user' },
      ],
    },

    { name: 'expirationDate', type: 'date' },

    /* -------------------------------------------
     * TAGGING / AI
     * ------------------------------------------- */
    {
      name: 'categories',
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

    {
      name: 'autoTags',
      label: 'AI Tags',
      type: 'array',
      fields: [
        { name: 'tag', type: 'text' },
        { name: 'confidence', type: 'number' },
      ],
    },

    /* -------------------------------------------
     * ANALYTICS
     * ------------------------------------------- */
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'downloadCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },

    {
      name: 'waveform',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        { name: 'bins', type: 'number' },

        {
          name: 'peaks',
          type: 'array',
          label: 'Waveform Peaks',
          fields: [{ name: 'value', type: 'number' }],
        },

        { name: 'version', type: 'number' },
        { name: 'sampleCount', type: 'number' },
        { name: 'durationSeconds', type: 'number' },
        { name: 'updatedAt', type: 'date' },

        // 👉 ADD THIS (fixes your error)
        { name: 'imagePath', type: 'text' },
      ],
    },

    /* -------------------------------------------
     * SEO
     * ------------------------------------------- */
    SEOFields,
  ],
}
