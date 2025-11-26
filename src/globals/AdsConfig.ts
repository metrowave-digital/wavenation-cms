// src/globals/AdsConfig.ts
import type { GlobalConfig } from 'payload'

export const AdsConfig: GlobalConfig = {
  slug: 'ads-config',
  label: 'Ads Configuration',

  admin: { group: 'SYSTEM' },

  fields: [
    { name: 'maxAdsPerHour', type: 'number', defaultValue: 6 },
    { name: 'defaultRotation', type: 'number', defaultValue: 3 },
    {
      name: 'fallbackHouseAds',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      label: 'Fallback House Ads',
    },
  ],
}
