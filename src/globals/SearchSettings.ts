// src/globals/SearchSettings.ts
import type { GlobalConfig } from 'payload'

export const SearchSettings: GlobalConfig = {
  slug: 'search-settings',
  label: 'Search Settings',

  admin: { group: 'SYSTEM' },

  fields: [
    { name: 'enableVectorSearch', type: 'checkbox', defaultValue: true },
    { name: 'minScore', type: 'number', defaultValue: 0.35 },
    { name: 'maxResults', type: 'number', defaultValue: 25 },
    {
      name: 'synonyms',
      type: 'array',
      fields: [{ name: 'pair', type: 'text' }],
    },
  ],
}
