import type { CollectionConfig, Access, FieldAccess } from 'payload'

import { articleFields } from './fields'
import { articleHooks } from './hooks'
import * as ArticleBlocks from './blocks'

/* ============================================================
   ACCESS CONTROL
============================================================ */

import { isCreator, isStaff, isPublic, hasRoleAtOrAbove } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   ACCESS HELPERS (TYPE-SAFE)
============================================================ */

const canUpdateArticle: Access = ({ req }) => {
  if (!req?.user) return false
  return hasRoleAtOrAbove(req, Roles.EDITOR)
}

const editorialFieldUpdate: FieldAccess = ({ req }) => {
  if (!req?.user) return false
  return hasRoleAtOrAbove(req, Roles.EDITOR)
}

/* ============================================================
   COLLECTION
============================================================ */

export const Articles: CollectionConfig = {
  slug: 'articles',

  labels: {
    singular: 'Article',
    plural: 'Articles',
  },

  versions: true,

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'status', 'publishedDate'],
    group: 'Content',
  },

  /* -----------------------------------------------------------
     ACCESS
  ----------------------------------------------------------- */
  access: {
    read: isPublic,
    create: isCreator,
    update: canUpdateArticle,
    delete: isStaff,
  },

  /* -----------------------------------------------------------
     FIELDS — DATA SAFE
  ----------------------------------------------------------- */
  fields: [
    /* ================= TITLE + TYPE ================= */
    {
      type: 'row',
      fields: [
        {
          type: 'text',
          name: 'title',
          required: true,
          admin: { width: '70%' },
        },
        {
          type: 'select',
          name: 'type',
          required: true,
          admin: { width: '30%' },
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Breaking News', value: 'breaking-news' },
            { label: 'Music Review', value: 'music-review' },
            { label: 'Film / TV Review', value: 'film-tv-review' },
            { label: 'Interview', value: 'interview' },
            { label: 'Feature', value: 'feature' },
            { label: 'Event Recap', value: 'event-recap' },
            { label: 'African-American / Southern Culture', value: 'african-american-culture' },
            { label: 'Lifestyle', value: 'lifestyle' },
            { label: 'Faith & Inspiration', value: 'faith-inspiration' },
            { label: 'Sponsored Content', value: 'sponsored' },
            { label: 'Creator Spotlight', value: 'creator-spotlight' },
          ],
        },
      ],
    },

    /* ================= STATUS ================= */
    {
      type: 'select',
      name: 'status',
      required: true,
      defaultValue: 'draft',
      access: { update: editorialFieldUpdate },
      admin: { position: 'sidebar' },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'review' },
        { label: 'Needs Correction', value: 'needs-correction' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Published', value: 'published' },
      ],
    },

    /* ================= BADGES ================= */
    {
      type: 'select',
      name: 'badges',
      hasMany: true,
      admin: { position: 'sidebar' },
      access: { update: editorialFieldUpdate },
      options: [
        { label: 'Breaking News', value: 'breaking' },
        { label: 'Staff Pick', value: 'staff-pick' },
        { label: 'Discussed on WaveNation FM', value: 'radio' },
        { label: 'Watch on WaveNation One', value: 'tv' },
        { label: 'Sponsored', value: 'sponsored' },
        { label: 'Exclusive', value: 'exclusive' },
        { label: 'News Menu Feature', value: 'news-menu-feature' },
        { label: 'Discover Menu Feature', value: 'discover-menu-feature' },
      ],
    },

    /* ================= HERO IMAGE ================= */
    {
      type: 'upload',
      name: 'heroImage',
      relationTo: 'media',
      access: { update: editorialFieldUpdate },
    },
    {
      type: 'text',
      name: 'heroImageAlt',
      access: { update: editorialFieldUpdate },
    },

    /* ================= PUBLISHING ================= */
    {
      type: 'date',
      name: 'publishedDate',
      admin: { position: 'sidebar' },
      access: { update: editorialFieldUpdate },
    },
    {
      type: 'date',
      name: 'scheduledPublishDate',
      admin: { position: 'sidebar' },
      access: { update: editorialFieldUpdate },
    },
    {
      type: 'date',
      name: 'lastUpdated',
      admin: { position: 'sidebar', readOnly: true },
    },

    /* ================= AUTHOR (UI-SAFE) ================= */
    {
      type: 'relationship',
      name: 'author',
      relationTo: 'profiles',
      access: { update: editorialFieldUpdate },
      admin: {
        condition: (_, data) => Boolean(data?.author),
      },
    },

    /* ================= SLUG ================= */
    {
      type: 'text',
      name: 'slug',
      unique: true,
      admin: { position: 'sidebar' },
      access: { update: editorialFieldUpdate },
    },

    /* ================= SPONSOR DISCLOSURE ================= */
    {
      type: 'textarea',
      name: 'sponsorDisclosure',
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.type === 'sponsored',
      },
      access: { update: editorialFieldUpdate },
    },

    /* ================= MEDIA TIE-IN (UI-SAFE) ================= */
    {
      type: 'group',
      name: 'mediaTieIn',
      access: { update: editorialFieldUpdate },
      admin: {
        condition: (_, data) => Boolean(data?.mediaTieIn),
      },
      fields: [
        {
          type: 'select',
          name: 'type',
          options: [
            { label: 'Radio', value: 'radio' },
            { label: 'TV', value: 'tv' },
            { label: 'Playlist', value: 'playlist' },
          ],
        },
        { type: 'text', name: 'label' },
        {
          type: 'relationship',
          name: 'relatedEntity',
          relationTo: ['shows', 'playlists'],
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.relatedEntity),
          },
        },
        { type: 'text', name: 'url' },
      ],
    },

    /* ================= CTA ================= */
    {
      type: 'group',
      name: 'cta',
      access: { update: editorialFieldUpdate },
      fields: [
        {
          type: 'select',
          name: 'type',
          options: [
            { label: 'Subscribe', value: 'subscribe' },
            { label: 'Listen Live', value: 'listen-live' },
            { label: 'Watch More', value: 'watch-more' },
            { label: 'Join WaveNation+', value: 'join-plus' },
          ],
        },
        { type: 'text', name: 'headline' },
        { type: 'textarea', name: 'description' },
        { type: 'text', name: 'buttonLabel' },
        { type: 'text', name: 'buttonUrl' },
      ],
    },

    /* ================= READING TIME ================= */
    {
      type: 'number',
      name: 'readingTime',
      admin: { readOnly: true },
      access: {
        create: () => true,
        update: () => true,
      },
    },

    /* ================= EDITORIAL NOTES ================= */
    {
      type: 'textarea',
      name: 'editorialNotes',
      admin: { position: 'sidebar' },
      access: { update: editorialFieldUpdate },
    },

    /* ================= PLAYLISTS (UI-SAFE) ================= */
    {
      type: 'relationship',
      name: 'playlists',
      relationTo: 'playlists',
      hasMany: true,
      access: { update: editorialFieldUpdate },
      admin: {
        condition: (_, data) => Array.isArray(data?.playlists) && data.playlists.length > 0,
      },
    },

    /* ================= CONTENT BLOCKS ================= */
    {
      type: 'blocks',
      name: 'contentBlocks',
      blocks: [
        ArticleBlocks.RichTextBlock,
        ArticleBlocks.ImageBlock,
        ArticleBlocks.VideoBlock,
        ArticleBlocks.CarouselBlock,
        ArticleBlocks.PullQuoteBlock,
        ArticleBlocks.CalloutBlock,
        ArticleBlocks.EmbedBlock,
        ArticleBlocks.SideBySideBlock,
        ArticleBlocks.DropcapParagraphBlock,
        ArticleBlocks.TimelineBlock,
        ArticleBlocks.QuoteWithImageBlock,
        ArticleBlocks.AuthorBioBlock,
        ArticleBlocks.AdsBlock,
        ArticleBlocks.FootnotesBlock,
        ArticleBlocks.InteractivePollBlock,
      ],
    },

    /* ================= TEMPLATE FIELDS ================= */
    ...articleFields,
  ],

  hooks: articleHooks,
}

export default Articles
