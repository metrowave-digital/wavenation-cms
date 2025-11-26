import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'

export const Analytics: CollectionConfig = {
  slug: 'analytics',

  labels: {
    singular: 'Analytics Summary',
    plural: 'Analytics Summaries',
  },

  admin: {
    group: 'Analytics',
    useAsTitle: 'adminLabel',
    defaultColumns: ['adminLabel', 'plays', 'views', 'likes', 'trendScore'],
  },

  access: {
    read: allowRoles(['admin', 'editor', 'analyst']),
    create: allowRoles(['admin']),
    update: allowRoles(['admin']),
    delete: allowRoles(['admin']),
  },

  timestamps: true,

  fields: [
    // Display label
    {
      name: 'adminLabel',
      type: 'text',
      admin: { readOnly: true },
    },

    // Relationship to content
    {
      name: 'relatedContent',
      type: 'relationship',
      required: true,
      relationTo: ['episodes', 'films', 'articles', 'series', 'posts', 'polls'],
    },

    // Core engagement metrics
    { name: 'plays', type: 'number', defaultValue: 0 },
    { name: 'views', type: 'number', defaultValue: 0 },
    { name: 'likes', type: 'number', defaultValue: 0 },
    { name: 'shares', type: 'number', defaultValue: 0 },
    { name: 'comments', type: 'number', defaultValue: 0 },

    // Completion metrics
    {
      name: 'completionRate',
      type: 'number',
      admin: { description: 'Average completion % (0–100).' },
    },

    {
      name: 'averageWatchTimeSeconds',
      type: 'number',
      admin: { description: 'Avg watch/listen duration in seconds.' },
    },

    // Device breakdown
    {
      name: 'deviceTypes',
      type: 'array',
      label: 'Device Breakdown',
      fields: [
        { name: 'device', type: 'text' },
        { name: 'count', type: 'number' },
      ],
    },

    // Geo breakdown
    {
      name: 'geoData',
      type: 'array',
      label: 'Geographic Breakdown',
      fields: [
        { name: 'location', type: 'text' },
        { name: 'count', type: 'number' },
      ],
    },

    // Hourly heatmap
    {
      name: 'hourlyDistribution',
      type: 'array',
      label: 'Hourly Audience Distribution',
      fields: [
        { name: 'hour', type: 'number' }, // 0–23
        { name: 'count', type: 'number' },
      ],
    },

    // DOW heatmap
    {
      name: 'dowDistribution',
      type: 'array',
      label: 'Day-of-Week Distribution',
      fields: [
        { name: 'day', type: 'number' }, // 0–6
        { name: 'count', type: 'number' },
      ],
    },

    // Retention buckets
    {
      name: 'retentionBuckets',
      type: 'array',
      label: 'Retention Curve Buckets (0–100%)',
      fields: [
        { name: 'bucketStart', type: 'number' },
        { name: 'bucketEnd', type: 'number' },
        { name: 'count', type: 'number' },
      ],
    },

    // 🔥 Channel Rollup (Radio, TV, Web, Mobile, etc.)
    {
      name: 'channelRollup',
      type: 'array',
      label: 'Per-Channel Breakdown',
      fields: [
        { name: 'channel', type: 'text' },
        { name: 'plays', type: 'number' },
        { name: 'views', type: 'number' },
        { name: 'likes', type: 'number' },
        { name: 'engagementScore', type: 'number' },
      ],
    },

    // 🔥 Category Rollup (Hip-Hop, Gospel, Afrobeats)
    {
      name: 'categoryRollup',
      type: 'array',
      label: 'Category Breakdown',
      fields: [
        { name: 'category', type: 'text' },
        { name: 'plays', type: 'number' },
        { name: 'views', type: 'number' },
        { name: 'likes', type: 'number' },
        { name: 'trendScore', type: 'number' },
      ],
    },

    // 🔥 Origin Rollup (Instagram, TikTok, direct, push, etc.)
    {
      name: 'originRollup',
      type: 'array',
      label: 'Traffic Origin Breakdown',
      fields: [
        { name: 'origin', type: 'text' },
        { name: 'count', type: 'number' },
      ],
    },

    // Advanced engagement score
    {
      name: 'engagementScore',
      type: 'number',
      admin: {
        description: 'Weighted engagement score: plays + views + likes*2 + shares*3 + comments*2.',
      },
    },

    // Trend score
    {
      name: 'trendScore',
      type: 'number',
      admin: {
        description: 'Engagement per day within aggregation window.',
      },
    },

    // Predictions
    {
      name: 'predictedTrendScore',
      type: 'number',
      admin: { description: 'Predicted trend score for next window.' },
    },

    {
      name: 'predictedPlaysNext7Days',
      type: 'number',
      admin: { description: 'Forecast plays for next 7 days.' },
    },

    // Window metadata
    { name: 'windowStart', type: 'date' },
    { name: 'windowEnd', type: 'date' },
  ],

  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.relatedContent) {
          const rel: any = data.relatedContent
          const label =
            typeof rel === 'object'
              ? `${rel?.relationTo ?? ''} — ${rel?.value ?? ''}`
              : `Content — ${rel}`
          data.adminLabel = label
        }
        return data
      },
    ],
  },
}
