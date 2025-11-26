import type { CollectionConfig } from 'payload'
import { allowRoles, isAdmin, publicRead } from '@/access/control'
import { generateSlug } from '@/hooks/generateSlug'
import { SEOFields } from '@/fields/seo'

export const Playlists: CollectionConfig = {
  slug: 'playlists',

  admin: {
    useAsTitle: 'title',
    group: 'Music & Audio',
    defaultColumns: ['title', 'type', 'status', 'visibility', 'featuredPriority', 'staffPick'],
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'host-dj', 'admin']),
    update: allowRoles(['editor', 'host-dj', 'admin']),
    delete: isAdmin,
  },

  hooks: {
    beforeChange: [generateSlug],
  },

  fields: [
    /* --------------------------------
     * BASIC INFO
     * -------------------------------- */
    { name: 'title', type: 'text', required: true },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { description: 'Auto-generated slug for playlist URL.' },
    },

    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'editorial',
      options: [
        { label: 'Editorial', value: 'editorial' },
        { label: 'Radio Rotation', value: 'rotation' },
        { label: 'Mood Playlist', value: 'mood' },
        { label: 'Show Playlist', value: 'show' },
        { label: 'Episode Playlist', value: 'episode' },
        { label: 'Event / Festival', value: 'event' },
        { label: 'User Playlist', value: 'user' },
      ],
    },

    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Unlisted', value: 'unlisted' },
        { label: 'Private', value: 'private' },
      ],
    },

    { name: 'description', type: 'textarea' },

    /* --------------------------------
     * CURATED METADATA (Playlists 2.0)
     * -------------------------------- */
    {
      name: 'vibeTags',
      type: 'array',
      label: 'Vibe Tags',
      admin: { description: 'Energy descriptions like chill, hype, soulful, late-night, upbeat.' },
      fields: [{ name: 'tag', type: 'text' }],
    },

    {
      name: 'subgenres',
      type: 'array',
      label: 'Subgenre Tags',
      admin: { description: 'Subgenres like Neo-Soul, Trap Soul, Boom Bap, House, Afrobeats.' },
      fields: [{ name: 'subgenre', type: 'text' }],
    },

    {
      name: 'tempoRange',
      type: 'group',
      label: 'Tempo Range (BPM)',
      admin: { description: 'Used for recommendations + smart mixing.' },
      fields: [
        { name: 'minBPM', type: 'number' },
        { name: 'maxBPM', type: 'number' },
      ],
    },

    {
      name: 'popularityScore',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'AI/algorithm weight. Calculated from plays, likes, saves, etc.',
      },
    },

    {
      name: 'staffPick',
      type: 'checkbox',
      label: 'Staff Pick',
      defaultValue: false,
      admin: {
        description: 'Mark as staff/editorial highlight.',
      },
    },

    {
      name: 'featuredPriority',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: '0–5 priority. Higher = featured first on homepage & apps.',
      },
    },

    /* --------------------------------
     * MOODS & GENRES
     * -------------------------------- */
    {
      name: 'moods',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { description: 'Curated moods (chill, hype, focus, romantic, etc.)' },
    },

    {
      name: 'genres',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { description: 'Music genres represented in the playlist.' },
    },

    /* --------------------------------
     * ATTACH TO SHOWS / EPISODES
     * -------------------------------- */
    {
      name: 'attachedShow',
      type: 'relationship',
      relationTo: 'shows',
      admin: { description: 'Optional — playlist used on-air for a show.' },
    },

    {
      name: 'attachedEpisode',
      type: 'relationship',
      relationTo: 'episodes',
      admin: { description: 'Optional — episode-specific playlist.' },
    },

    /* --------------------------------
     * TRACKS
     * -------------------------------- */
    {
      name: 'tracks',
      type: 'array',
      admin: { description: 'Add tracks in playback order.' },
      fields: [
        {
          name: 'track',
          type: 'relationship',
          relationTo: 'tracks',
          required: true,
        },
        { name: 'notes', type: 'text' },
        { name: 'sortOrder', type: 'number' },
      ],
    },

    /* --------------------------------
     * SORTING
     * -------------------------------- */
    {
      name: 'orderType',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Manual', value: 'manual' },
        { label: 'A → Z', value: 'alphabetical' },
        { label: 'Z → A', value: 'reverse' },
        { label: 'Newest First', value: 'newest' },
        { label: 'Oldest First', value: 'oldest' },
        { label: 'By BPM', value: 'bpm' },
        { label: 'By Mood', value: 'mood' },
      ],
    },

    /* --------------------------------
     * IMAGES
     * -------------------------------- */
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'headerImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional hero banner for playlist page.' },
    },

    /* --------------------------------
     * OWNERSHIP
     * -------------------------------- */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
    },

    {
      name: 'contributors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },

    /* --------------------------------
     * AVAILABILITY
     * -------------------------------- */
    {
      name: 'scheduleWindow',
      type: 'group',
      label: 'Availability Window',
      fields: [
        { name: 'availableFrom', type: 'date' },
        { name: 'availableUntil', type: 'date' },
      ],
    },

    /* --------------------------------
     * ANALYTICS
     * -------------------------------- */
    { name: 'followerCount', type: 'number', defaultValue: 0 },
    { name: 'playCount', type: 'number', defaultValue: 0 },
    { name: 'likeCount', type: 'number', defaultValue: 0 },
    { name: 'shareCount', type: 'number', defaultValue: 0 },

    /* --------------------------------
     * STATUS
     * -------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },

    /* --------------------------------
     * SEO
     * -------------------------------- */

    SEOFields,
  ],
}
