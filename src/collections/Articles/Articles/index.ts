import type { CollectionConfig, Access, FieldAccess } from 'payload'

import { articleFields } from './fields'
import { articleHooks } from './hooks'
import * as ArticleBlocks from './blocks'

import {
  isCreator,
  isStaff,
  isPublic,
  hasRoleAtOrAbove,
  isAdminRole,
  apiLockedRead,
} from '@/access/control'

import { Roles } from '@/access/roles'

/* ============================================================
   COLLECTION READ ACCESS
============================================================ */

const canReadArticles: Access = ({ req }) => {
  // Admin UI (cookie auth)
  if (req?.user) return true

  // Public / frontend API (strict, centralized)
  return apiLockedRead({ req } as any)
}

/* ============================================================
   ACCESS HELPERS
============================================================ */

const canCreateArticle: Access = ({ req }) => {
  if (!req?.user) return false
  if (isAdminRole(req)) return true
  return isCreator({ req })
}

const canUpdateArticle: Access = ({ req, id }) => {
  if (!req?.user) return false

  // Admin override
  if (isAdminRole(req)) return true

  // Editor+
  if (hasRoleAtOrAbove(req, Roles.EDITOR)) return true

  // Creator can update own article
  if (isCreator({ req }) && id) {
    return {
      id: { equals: id },
      createdBy: { equals: req.user.id },
    }
  }

  return false
}

const canDeleteArticle: Access = ({ req, id }) => {
  if (!req?.user) return false

  // Admin + Staff override
  if (isAdminRole(req) || isStaff({ req })) return true

  // Creator can delete own article
  if (isCreator({ req }) && id) {
    return {
      id: { equals: id },
      createdBy: { equals: req.user.id },
    }
  }

  return false
}

/* ============================================================
   FIELD-LEVEL ACCESS (BOOLEAN ONLY)
============================================================ */

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

  access: {
    read: canReadArticles,
    create: canCreateArticle,
    update: canUpdateArticle,
    delete: canDeleteArticle,
  },

  fields: [
    /* ================= TITLE + TYPE ================= */
    {
      type: 'row',
      fields: [
        { type: 'text', name: 'title', required: true, admin: { width: '70%' } },
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
      defaultValue: 'draft',
      required: true,
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
        { label: 'Radio Feature', value: 'radio' },
        { label: 'TV Feature', value: 'tv' },
        { label: 'Sponsored', value: 'sponsored' },
        { label: 'Exclusive', value: 'exclusive' },
        { label: 'News Menu Feature', value: 'news-menu-feature' },
        { label: 'Discover Menu Feature', value: 'discover-menu-feature' },
      ],
    },

    /* ================= HERO ================= */
    {
      type: 'upload',
      name: 'heroImage',
      relationTo: 'media',
      access: { update: editorialFieldUpdate },
    },
    { type: 'text', name: 'heroImageAlt', access: { update: editorialFieldUpdate } },

    /* ================= PUBLISHING ================= */
    { type: 'date', name: 'publishedDate', admin: { position: 'sidebar' } },
    { type: 'date', name: 'scheduledPublishDate', admin: { position: 'sidebar' } },
    {
      type: 'select',
      name: 'scheduledPublishTimezone',
      defaultValue: 'UTC',
      admin: { position: 'sidebar' },
      options: [
        { label: 'UTC', value: 'UTC' },
        { label: 'US Eastern', value: 'America/New_York' },
        { label: 'US Central', value: 'America/Chicago' },
        { label: 'US Pacific', value: 'America/Los_Angeles' },
      ],
    },

    /* ================= AUDIT ================= */
    { type: 'date', name: 'lastUpdated', admin: { readOnly: true, position: 'sidebar' } },
    {
      type: 'relationship',
      name: 'createdBy',
      relationTo: 'users',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      type: 'relationship',
      name: 'updatedBy',
      relationTo: 'users',
      admin: { readOnly: true, position: 'sidebar' },
    },

    /* ================= AUTHOR ================= */
    {
      type: 'relationship',
      name: 'author',
      relationTo: 'profiles',
      access: { update: editorialFieldUpdate },
    },

    /* ================= SLUG ================= */
    { type: 'text', name: 'slug', unique: true, admin: { position: 'sidebar' } },

    /* ================= SPONSORED ================= */
    {
      type: 'textarea',
      name: 'sponsorDisclosure',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.type === 'sponsored',
      },
    },

    /* ================= MEDIA TIE-IN ================= */
    {
      type: 'group',
      name: 'mediaTieIn',
      fields: [
        { type: 'select', name: 'type', options: ['radio', 'tv', 'playlist'] },
        { type: 'text', name: 'label' },
        { type: 'relationship', name: 'relatedEntity', relationTo: ['shows', 'playlists'] },
        { type: 'text', name: 'url' },
      ],
    },

    /* ================= CTA ================= */
    {
      type: 'group',
      name: 'cta',
      fields: [
        {
          type: 'select',
          name: 'type',
          options: ['subscribe', 'listen-live', 'watch-more', 'join-plus'],
        },
        { type: 'text', name: 'headline' },
        { type: 'textarea', name: 'description' },
        { type: 'text', name: 'buttonLabel' },
        { type: 'text', name: 'buttonUrl' },
      ],
    },

    /* ================= READING ================= */
    { type: 'number', name: 'readingTime', admin: { readOnly: true } },

    /* ================= EDITORIAL NOTES ================= */
    { type: 'textarea', name: 'editorialNotes', admin: { position: 'sidebar' } },

    /* ================= PLAYLISTS ================= */
    { type: 'relationship', name: 'playlists', relationTo: 'playlists', hasMany: true },

    /* ================= CONTENT ================= */
    {
      type: 'blocks',
      name: 'contentBlocks',
      blocks: Object.values(ArticleBlocks),
    },

    /* ================= WORKFLOW LOG ================= */
    {
      type: 'array',
      name: 'workflowLog',
      admin: { readOnly: true },
      fields: [
        { type: 'text', name: 'from' },
        { type: 'text', name: 'to' },
        { type: 'relationship', name: 'by', relationTo: 'users' },
        { type: 'date', name: 'at' },
        { type: 'textarea', name: 'reason' },
      ],
    },

    /* ================= ROLLBACK ================= */
    {
      type: 'group',
      name: 'rollback',
      admin: { position: 'sidebar' },
      fields: [
        { type: 'text', name: 'sourceVersionId', admin: { readOnly: true } },
        { type: 'textarea', name: 'rollbackReason' },
        { type: 'date', name: 'rolledBackAt', admin: { readOnly: true } },
      ],
    },

    /* ================= MODERATION ================= */
    { type: 'number', name: 'toxicityScore', admin: { readOnly: true } },
    { type: 'checkbox', name: 'isToxic', admin: { readOnly: true } },

    {
      type: 'select',
      name: 'moderationStatus',
      defaultValue: 'unscanned',
      admin: { readOnly: true },
      options: ['unscanned', 'queued', 'scanned', 'flagged', 'error'],
    },

    {
      type: 'array',
      name: 'moderationLog',
      admin: { readOnly: true },
      fields: [
        { type: 'date', name: 'at' },
        { type: 'relationship', name: 'by', relationTo: 'users' },
        { type: 'text', name: 'action' },
        { type: 'number', name: 'score' },
        { type: 'checkbox', name: 'isToxic' },
        { type: 'textarea', name: 'message' },
      ],
    },

    /* ================= SEARCH INDEX ================= */
    { type: 'json', name: 'searchIndex', admin: { readOnly: true } },

    /* ================= TEMPLATE / VARIANT FIELDS ================= */
    ...articleFields,
  ],

  hooks: articleHooks,
}

export default Articles
