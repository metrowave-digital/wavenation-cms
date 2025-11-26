import type { CollectionConfig } from 'payload'

export const PlaybackProgress: CollectionConfig = {
  slug: 'playback-progress',

  labels: {
    singular: 'Playback Progress',
    plural: 'Playback Progress',
  },

  admin: {
    useAsTitle: 'itemId',
    group: 'Users',
    defaultColumns: [
      'user',
      'itemType',
      'itemId',
      'progress',
      'completedAt',
      'lastPositionSeconds',
    ],
  },

  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },

  fields: [
    /** --------------------------------------
     * 🔐 USER RELATIONSHIP
     * -------------------------------------- */
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    /** --------------------------------------
     * 🎬 CONTENT IDENTIFICATION
     * (Generic so works for: tracks, episodes, vod, music, videos)
     * -------------------------------------- */
    {
      name: 'itemType',
      type: 'text',
      required: true,
      admin: { description: 'Content collection slug (episodes, vod, tracks...)' },
    },
    {
      name: 'itemId',
      type: 'text',
      required: true,
    },

    /** --------------------------------------
     * ▶️ PLAYBACK METRICS
     * -------------------------------------- */
    {
      name: 'progress',
      type: 'number',
      required: true,
      admin: { description: 'Playback percentage 0–100' },
    },

    {
      name: 'lastPositionSeconds',
      type: 'number',
      admin: { description: 'Last known playback position in seconds' },
    },

    {
      name: 'durationSeconds',
      type: 'number',
      admin: { description: 'Cached media total duration (optional)' },
    },

    /** --------------------------------------
     * ✔ COMPLETION STATE
     * -------------------------------------- */
    {
      name: 'completedAt',
      type: 'date',
      admin: { description: 'Auto-filled when progress ≥ 95%' },
    },

    /** --------------------------------------
     * 📱 DEVICE SYNC
     * -------------------------------------- */
    {
      name: 'lastUpdatedDevice',
      type: 'text',
      admin: { description: 'mobile, web, tv, roku, fire, apple_tv' },
    },

    /** --------------------------------------
     * ⚡ UI FAST-FIELDS (cached from media)
     * Helps build "Continue Watching" without extra lookups
     * -------------------------------------- */
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Cached media title for UI lists' },
    },

    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },

    /** --------------------------------------
     * 🎧 SPECIAL FOR EPISODIC CONTENT
     * Speeds up next-episode discovery
     * -------------------------------------- */
    {
      name: 'episodeNumber',
      type: 'number',
      admin: { description: 'Cached episode number (for TV/podcasts)' },
    },
    {
      name: 'seasonNumber',
      type: 'number',
      admin: { description: 'Cached season number' },
    },
    {
      name: 'showId',
      type: 'text',
      admin: { description: 'Cached parent show ID' },
    },
  ],

  indexes: [
    {
      fields: ['user', 'itemId', 'itemType'],
      unique: true,
    },
    {
      fields: ['user', 'completedAt'],
    },
    {
      fields: ['showId', 'seasonNumber', 'episodeNumber'],
    },
  ],
}

export default PlaybackProgress
