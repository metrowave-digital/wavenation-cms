import type { CollectionConfig } from 'payload'
import { allowAdminsAnd } from '../access/control'

export const Profiles: CollectionConfig = {
  slug: 'profiles',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'featured'],
  },

  access: {
    read: () => true,
    create: allowAdminsAnd(['editor']),
    update: allowAdminsAnd(['editor']),
    delete: allowAdminsAnd(['admin']),
  },

  fields: [
    /* BASIC INFO */
    { name: 'name', type: 'text', required: true },

    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Artist', value: 'artist' },
        { label: 'DJ / Host', value: 'dj' },
        { label: 'Producer', value: 'producer' },
        { label: 'Songwriter', value: 'songwriter' },
        { label: 'Actor', value: 'actor' },
        { label: 'Model', value: 'model' },
        { label: 'Director', value: 'director' },
        { label: 'Filmmaker', value: 'filmmaker' },
        { label: 'Podcaster', value: 'podcaster' },
        { label: 'Journalist', value: 'journalist' },
        { label: 'Photographer', value: 'photographer' },
        { label: 'Influencer', value: 'influencer' },
        { label: 'Creator', value: 'creator' },
        { label: 'Public Figure', value: 'public-figure' },
        { label: 'Comedian', value: 'comedian' },
        { label: 'Dancer', value: 'dancer' },
        { label: 'Executive', value: 'executive' },
        { label: 'Other', value: 'other' },
      ],
    },

    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Primary headshot / profile photo.' },
    },

    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Banner image for their profile page.' },
    },

    { name: 'bio', type: 'richText' },

    /* SOCIALS */
    {
      name: 'socials',
      type: 'group',
      admin: { description: 'Creative-friendly social links.' },
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text', admin: { description: 'Facebook Page (not personal).' } },
        { name: 'twitter', type: 'text', label: 'X' },
        { name: 'tiktok', type: 'text' },
        { name: 'youtube', type: 'text' },
        { name: 'website', type: 'text' },
        { name: 'epk', type: 'text', label: 'EPK / Press Kit URL' },

        /* MUSIC PLATFORMS */
        { name: 'spotify', type: 'text' },
        { name: 'appleMusic', type: 'text', label: 'Apple Music' },
        { name: 'soundcloud', type: 'text' },
        { name: 'audiomack', type: 'text' },

        /* FILM / TV */
        { name: 'imdb', type: 'text', label: 'IMDb' },
        { name: 'triller', type: 'text' },
        { name: 'vimeo', type: 'text' },
      ],
    },

    /* CREATIVE CATEGORIES & TALENT INFO */
    {
      name: 'genres',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { description: 'Music or content genres.' },
    },

    {
      name: 'skills',
      type: 'array',
      admin: { description: "Creative skills & roles (e.g. 'editor', 'choreographer')." },
      fields: [{ name: 'skill', type: 'text' }],
    },

    {
      name: 'instruments',
      type: 'array',
      admin: { description: 'Instruments played (for musicians).' },
      fields: [{ name: 'instrument', type: 'text' }],
    },

    /* PORTFOLIO (MEDIA) */
    {
      name: 'portfolio',
      type: 'array',
      admin: { description: 'Add reels, videos, galleries, photography, graphics.' },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'caption',
          type: 'text',
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Photo', value: 'photo' },
            { label: 'Video', value: 'video' },
            { label: 'Reel / TikTok', value: 'reel' },
            { label: 'Artwork', value: 'art' },
          ],
        },
      ],
    },

    /* FILMOGRAPHY / DISCOGRAPHY / CREDITS */
    {
      name: 'credits',
      type: 'array',
      admin: {
        description: 'Film credits, songs written, podcasts featured on, shows hosted, etc.',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'role',
          type: 'text',
          admin: { description: 'Director, Actor, Host, Producer, etc.' },
        },
        {
          name: 'year',
          type: 'number',
        },
        {
          name: 'linkedShow',
          type: 'relationship',
          relationTo: 'shows',
        },
        {
          name: 'linkedEpisode',
          type: 'relationship',
          relationTo: 'episodes',
        },
        {
          name: 'linkedArticle',
          type: 'relationship',
          relationTo: 'articles',
        },
      ],
    },

    /* STATISTICS */
    {
      name: 'metrics',
      type: 'group',
      fields: [
        { name: 'followers', type: 'number', defaultValue: 0 },
        { name: 'monthlyListeners', type: 'number', defaultValue: 0 },
        { name: 'awards', type: 'number', defaultValue: 0 },
      ],
    },

    /* FLAGS */
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Featured on homepage / editorial pick.' },
    },
    {
      name: 'trending',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'risingStar',
      type: 'checkbox',
      defaultValue: false,
    },

    /* TAGS */
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
  ],
}
