import type { Field } from 'payload'

export const EnhancedAudioMetadata: Field = {
  name: 'audioMetadata',
  label: 'Audio Metadata',
  type: 'group',

  admin: {
    condition: (_, data) => data?.type === 'audio' || data?.isAudio === true,
    description: 'Technical audio metadata extracted from files.',
  },

  fields: [
    /* -----------------------------------------------------
     * CORE TECHNICAL METADATA
     * ----------------------------------------------------- */
    { name: 'duration', type: 'number', label: 'Duration (seconds)' },
    { name: 'bitrate', type: 'number', label: 'Bitrate (kbps)' },
    { name: 'sampleRate', type: 'number', label: 'Sample Rate (hz)' },
    { name: 'channels', type: 'number', label: 'Channels (1=mono, 2=stereo)' },

    /* -----------------------------------------------------
     * MUSIC METADATA (MM / OpenAI)
     * ----------------------------------------------------- */
    { name: 'bpm', type: 'number', label: 'Tempo / BPM' },
    { name: 'key', type: 'text', label: 'Musical Key (e.g. A#m, D, Gm)' },
    { name: 'genre', type: 'text', label: 'Detected Genre' },

    {
      name: 'mood',
      type: 'array',
      label: 'Mood Tags',
      fields: [{ name: 'tag', type: 'text' }],
    },

    /* -----------------------------------------------------
     * WAVEFORM + LOUDNESS
     * ----------------------------------------------------- */
    {
      name: 'waveform',
      type: 'text',
      label: 'Waveform JSON Path',
      admin: {
        description: 'Generated waveform JSON for frontend visualizers.',
      },
    },

    {
      name: 'loudness',
      type: 'group',
      label: 'Loudness Analysis (LUFS)',
      fields: [
        { name: 'integrated', type: 'number', label: 'Integrated LUFS' },
        { name: 'shortTerm', type: 'number', label: 'Short Term LUFS' },
        { name: 'momentary', type: 'number', label: 'Momentary LUFS' },
        { name: 'truePeak', type: 'number', label: 'True Peak (dbTP)' },
      ],
    },

    /* -----------------------------------------------------
     * SPEECH / TRANSCRIPT
     * ----------------------------------------------------- */
    {
      name: 'transcript',
      type: 'textarea',
      label: 'Whisper Transcript (Auto)',
    },
  ],
}
