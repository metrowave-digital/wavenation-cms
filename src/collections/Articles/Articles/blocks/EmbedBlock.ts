import type { Block } from 'payload'

export const EmbedBlock: Block = {
  slug: 'embed',
  labels: {
    singular: 'Embed',
    plural: 'Embeds',
  },

  fields: [
    /* ============================================================
       EMBED SOURCE
    ============================================================ */

    {
      name: 'embedUrl',
      type: 'text',
      label: 'Embed URL',
      required: true,
      admin: {
        placeholder: 'https://youtube.com/…, https://twitter.com/…, https://open.spotify.com/…',
        description: 'URL to embed (social post, video, chart, audio, map, etc.).',
      },
    },

    /* ============================================================
       PROVIDER (OPTIONAL, AUTO-DETECTABLE)
    ============================================================ */

    {
      name: 'provider',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto Detect', value: 'auto' },
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'X / Twitter', value: 'twitter' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'TikTok', value: 'tiktok' },
        { label: 'Spotify', value: 'spotify' },
        { label: 'Apple Music', value: 'apple-music' },
        { label: 'SoundCloud', value: 'soundcloud' },
        { label: 'Google Maps', value: 'maps' },
        { label: 'Chart / Data Viz', value: 'chart' },
        { label: 'Custom Iframe', value: 'iframe' },
      ],
      admin: {
        description: 'Override provider detection if needed.',
      },
    },

    /* ============================================================
       PRESENTATION
    ============================================================ */

    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Optional caption displayed below the embedded content.',
      },
    },

    {
      type: 'row',
      fields: [
        {
          name: 'aspectRatio',
          type: 'select',
          defaultValue: 'auto',
          options: [
            { label: 'Auto', value: 'auto' },
            { label: '16:9', value: '16:9' },
            { label: '4:3', value: '4:3' },
            { label: '1:1', value: '1:1' },
          ],
          admin: {
            description: 'Controls iframe/video aspect ratio.',
          },
        },
        {
          name: 'alignment',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
            { label: 'Full Width', value: 'full' },
          ],
        },
      ],
    },

    /* ============================================================
       ACCESSIBILITY
    ============================================================ */

    {
      name: 'ariaLabel',
      type: 'text',
      admin: {
        description: 'Optional accessibility label for screen readers.',
      },
    },

    /* ============================================================
       SECURITY / SANDBOXING
    ============================================================ */

    {
      name: 'sandbox',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Apply iframe sandboxing for security (recommended).',
      },
    },

    {
      name: 'allowFullscreen',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Allow fullscreen playback when supported.',
      },
    },

    /* ============================================================
       ANALYTICS / TRACKING
    ============================================================ */

    {
      name: 'trackingId',
      type: 'text',
      admin: {
        description: 'Optional analytics identifier for embed engagement.',
      },
    },

    /* ============================================================
       INTERNAL (NON-RENDERED)
    ============================================================ */

    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Internal editorial or technical notes (not public).',
      },
    },
  ],
}
