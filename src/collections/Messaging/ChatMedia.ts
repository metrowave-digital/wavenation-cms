import type { CollectionConfig } from 'payload'

export const ChatMedia: CollectionConfig = {
  slug: 'chat-media',

  admin: {
    useAsTitle: 'filename',
    group: 'Messaging',
  },

  upload: {
    // using S3/R2 — configured in payload.config.ts
    disableLocalStorage: true,
    mimeTypes: ['image/*', 'video/*', 'audio/*'],

    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'center',
      },
    ],

    // ❌ removed staticDir/staticURL — invalid in v3
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  fields: [
    {
      name: 'chat',
      type: 'relationship',
      relationTo: 'chats',
      required: true,
    },
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },
    { name: 'description', type: 'textarea' },
    { name: 'metadata', type: 'json' },
  ],
}
