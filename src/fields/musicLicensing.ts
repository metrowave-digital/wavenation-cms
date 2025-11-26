import type { Field } from 'payload'

export const MusicLicensingFields: Field = {
  name: 'musicLicensing',
  label: 'Music Licensing & Rights',
  type: 'group',
  admin: {
    description: 'Required for royalties, rights management, and distribution.',
  },
  fields: [
    { name: 'writer', type: 'text', label: 'Writer' },
    { name: 'composer', type: 'text', label: 'Composer' },
    { name: 'publisher', type: 'text', label: 'Publisher' },
    { name: 'rightsOwner', type: 'text', label: 'Rights Owner' },

    { name: 'isrc', type: 'text', label: 'ISRC Code' },
    { name: 'upc', type: 'text', label: 'UPC / EAN' },

    {
      name: 'licenseType',
      type: 'select',
      label: 'License Type',
      defaultValue: 'owned',
      options: [
        { label: 'Owned', value: 'owned' },
        { label: 'Licensed', value: 'licensed' },
        { label: 'User Submitted', value: 'user-submitted' },
        { label: 'Creative Commons', value: 'cc' },
        { label: 'Royalty Free', value: 'royalty-free' },
        { label: 'Public Domain', value: 'public-domain' },
      ],
    },

    { name: 'licenseExpiration', type: 'date', label: 'License Expiration' },

    {
      name: 'usageRestrictions',
      type: 'textarea',
      label: 'Usage Restrictions',
      admin: {
        description: 'Example: Only allowed on WaveNation platforms, not for syndication.',
      },
    },
  ],
}
