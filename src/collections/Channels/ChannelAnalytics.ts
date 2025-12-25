// src/collections/ChannelAnalytics.ts
import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const ChannelAnalytics: CollectionConfig = {
  slug: 'channel-analytics',

  admin: {
    useAsTitle: 'id',
    group: 'Creator Channels',
    defaultColumns: ['channel', 'date', 'scope', 'createdAt'],
    description: 'System-generated analytics snapshots. Read-only for humans.',
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (SYSTEM OF RECORD)
     - Read:
         • logged-in users (UI will scope by channel)
     - Create:
         • system / admin only (workers, cron jobs)
     - Update:
         • system / admin only (backfills, corrections)
     - Delete:
         • admin only (rare, audited)
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isLoggedIn,

    create: ({ req }) => AccessControl.hasRole(req, ['system' as any, 'admin' as any]),

    update: ({ req }) => AccessControl.hasRole(req, ['system' as any, 'admin' as any]),

    delete: AccessControl.isAdmin,
  },

  timestamps: true,

  fields: [
    /* ================= CHANNEL ================= */
    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'creator-channels',
      required: true,
      admin: {
        description: 'Channel this analytics snapshot belongs to',
      },
      access: {
        update: () => false,
      },
    },

    /* ================= SCOPE / TIME ================= */
    {
      name: 'scope',
      type: 'select',
      defaultValue: 'daily',
      options: [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Lifetime Snapshot', value: 'lifetime' },
      ],
      admin: {
        description: 'Aggregation window for this snapshot',
      },
      access: {
        update: () => false,
      },
    },

    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        description: 'Anchor date for this snapshot (e.g. day start, week start)',
      },
      access: {
        update: () => false,
      },
    },

    /* ================= CORE METRICS ================= */
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
    },

    {
      name: 'uniqueViewers',
      type: 'number',
      defaultValue: 0,
    },

    {
      name: 'watchTimeMinutes',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total watch time (minutes) across all content',
      },
    },

    {
      name: 'averageViewDurationSeconds',
      type: 'number',
      defaultValue: 0,
    },

    /* ================= SUBSCRIBERS ================= */
    {
      name: 'subscribersGained',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'subscribersLost',
      type: 'number',
      defaultValue: 0,
    },

    /* ================= ENGAGEMENT ================= */
    {
      name: 'engagement',
      type: 'group',
      fields: [
        { name: 'likes', type: 'number', defaultValue: 0 },
        { name: 'comments', type: 'number', defaultValue: 0 },
        { name: 'shares', type: 'number', defaultValue: 0 },
        { name: 'pollVotes', type: 'number', defaultValue: 0 },
        { name: 'chatMessages', type: 'number', defaultValue: 0 },
      ],
    },

    /* ================= REVENUE ATTRIBUTION ================= */
    {
      name: 'revenue',
      type: 'group',
      admin: {
        description: 'Attributed revenue for this window. Informational unless reconciled.',
      },
      fields: [
        { name: 'subscriptions', type: 'number', defaultValue: 0 },
        { name: 'contentPurchases', type: 'number', defaultValue: 0 },
        { name: 'tips', type: 'number', defaultValue: 0 },
        { name: 'ads', type: 'number', defaultValue: 0 },
        {
          name: 'currency',
          type: 'text',
          defaultValue: 'USD',
        },
      ],
    },

    /* ================= BREAKDOWNS ================= */
    {
      name: 'breakdowns',
      type: 'json',
      admin: {
        description: 'Optional breakdowns (content type, device, geo, referrer, etc.)',
      },
    },

    /* ================= AUDIT ================= */
    {
      name: 'generatedBy',
      type: 'select',
      defaultValue: 'system',
      options: [
        { label: 'System', value: 'system' },
        { label: 'Backfill Job', value: 'backfill' },
        { label: 'Manual Admin Override', value: 'manual' },
      ],
      admin: {
        description: 'Source of this analytics snapshot',
      },
      access: {
        update: AccessControl.isAdminField,
      },
    },
  ],
}

export default ChannelAnalytics
