// src/globals/StreamingConfig.ts
import type { GlobalConfig } from 'payload'

export const StreamingConfig: GlobalConfig = {
  slug: 'streaming-config',
  label: 'Streaming Configuration',

  admin: { group: 'SYSTEM' },

  fields: [
    {
      name: 'playerTheme',
      type: 'select',
      label: 'Player Theme',
      options: [
        { label: 'Dark', value: 'dark' },
        { label: 'Light', value: 'light' },
      ],
      defaultValue: 'dark',
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Enable Autoplay',
      defaultValue: true,
    },
    {
      name: 'resumePlayback',
      type: 'checkbox',
      label: 'Resume Playback',
      defaultValue: true,
    },
    {
      name: 'defaultBitrate',
      type: 'number',
      defaultValue: 4800,
      label: 'Default Bitrate (kbps)',
    },
  ],
}
