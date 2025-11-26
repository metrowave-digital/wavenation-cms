// src/globals/FeatureToggles.ts
import type { GlobalConfig } from 'payload'

export const FeatureToggles: GlobalConfig = {
  slug: 'feature-toggles',
  label: 'Feature Toggles',

  fields: [
    {
      name: 'flags',
      type: 'group',
      fields: [
        { name: 'enableChat', type: 'checkbox', defaultValue: false },
        { name: 'enableNewPlayer', type: 'checkbox', defaultValue: false },
        { name: 'enableAIRecs', type: 'checkbox', defaultValue: true },
        { name: 'enableTVHomepage', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}

export default FeatureToggles
