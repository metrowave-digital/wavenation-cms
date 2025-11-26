import type { Field } from 'payload'

export const EnhancedVideoMetadata: Field = {
  name: 'videoMetadata',
  label: 'Video Metadata',
  type: 'group',

  admin: {
    condition: (_, data) => data?.type === 'video' || data?.isVideo === true,
    description: 'Technical & streaming metadata for videos.',
  },

  fields: [
    /* -------------------------------------------
     * EXTRACTOR FIELDS
     * ------------------------------------------- */
    { name: 'duration', type: 'number', label: 'Duration (seconds)' },
    { name: 'width', type: 'number', label: 'Width (px)' },
    { name: 'height', type: 'number', label: 'Height (px)' },
    { name: 'bitrate', type: 'number', label: 'Bitrate (kbps)' },
    { name: 'frameRate', type: 'number', label: 'Frame Rate (fps)' },

    {
      name: 'thumbnail',
      type: 'text',
      label: 'Extracted Thumbnail Path',
      admin: {
        description: 'Auto-generated preview from first frame.',
      },
    },

    { name: 'dominantColor', type: 'text', label: 'Dominant Color (Auto)' },

    /* -------------------------------------------
     * VIDEO SOURCE + STREAMING
     * ------------------------------------------- */
    {
      name: 'videoSource',
      label: 'Video Source',
      type: 'select',
      defaultValue: 'file',
      options: [
        { label: 'Uploaded File', value: 'file' },
        { label: 'Cloudflare Stream', value: 'cloudflare' },
        { label: 'HLS / DASH CDN', value: 'cdn' },
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'YouTube (unlisted/private)', value: 'youtube' },
      ],
    },

    {
      name: 'sourceUrl',
      type: 'text',
      label: 'Source URL / Video ID',
      admin: {
        description: 'Cloudflare Stream ID, HLS URL, Vimeo ID, or YouTube ID.',
      },
    },

    {
      name: 'cdnVariants',
      label: 'Adaptive Bitrate Variants',
      type: 'array',
      fields: [
        { name: 'quality', type: 'text', label: 'Quality (e.g., 720p)' },
        { name: 'url', type: 'text', label: 'CDN URL' },
      ],
    },

    /* -------------------------------------------
     * CAPTIONS & SUBTITLES
     * ------------------------------------------- */
    {
      name: 'captions',
      label: 'Caption / Subtitle Tracks',
      type: 'array',
      fields: [
        { name: 'lang', type: 'text', label: 'Language Code (en, es, fr)' },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          label: 'VTT Caption File',
        },
      ],
    },

    /* -------------------------------------------
     * CONTENT RATING
     * ------------------------------------------- */
    {
      name: 'contentRating',
      type: 'select',
      label: 'Rating',
      defaultValue: 'unrated',
      options: [
        { label: 'Unrated', value: 'unrated' },
        { label: 'G', value: 'g' },
        { label: 'PG', value: 'pg' },
        { label: 'PG-13', value: 'pg-13' },
        { label: 'R', value: 'r' },
        { label: 'TV-Y', value: 'tv-y' },
        { label: 'TV-G', value: 'tv-g' },
        { label: 'TV-PG', value: 'tv-pg' },
        { label: 'TV-14', value: 'tv-14' },
        { label: 'TV-MA', value: 'tv-ma' },
        { label: 'Explicit (Music Video)', value: 'explicit' },
      ],
    },

    {
      name: 'explicit',
      type: 'checkbox',
      label: 'Explicit Content (AI / manual)',
      defaultValue: false,
    },

    /* -------------------------------------------
     * CHAPTERS + TRANSCRIPTS
     * ------------------------------------------- */
    {
      name: 'chapters',
      type: 'array',
      label: 'Detected Scene Changes / Chapters',
      fields: [
        { name: 'start', type: 'number', label: 'Start (seconds)' },
        { name: 'end', type: 'number', label: 'End (seconds)' },
      ],
    },

    {
      name: 'transcript',
      type: 'textarea',
      label: 'Transcript (Auto-Generated via Whisper)',
    },
  ],
}
