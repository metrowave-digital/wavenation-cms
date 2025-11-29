import type { CollectionConfig } from 'payload'

export const Messages: CollectionConfig = {
  slug: 'messages',

  admin: {
    useAsTitle: 'id',
    group: 'Communications',
    defaultColumns: ['sender', 'chat', 'status', 'createdAt'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => false, // no deleting messages
  },

  timestamps: true,

  fields: [
    /* ---------------------------------------------------------
     * WHO SENT THE MESSAGE
     --------------------------------------------------------- */
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    /* ---------------------------------------------------------
     * WHAT CHAT THIS MESSAGE BELONGS TO
     --------------------------------------------------------- */
    {
      name: 'chat',
      type: 'relationship',
      relationTo: 'chats',
      required: true,
    },

    /* ---------------------------------------------------------
     * MESSAGE CONTENT
     --------------------------------------------------------- */
    {
      name: 'text',
      type: 'textarea',
      admin: { description: 'Message content (optional if attachments exist)' },
    },

    {
      name: 'attachments',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Images, audio, video, files.',
      },
    },

    {
      name: 'replyTo',
      type: 'relationship',
      relationTo: 'messages',
      admin: { description: 'Threaded replies (optional)' },
    },

    /* ---------------------------------------------------------
     * STATUS + READ RECEIPTS
     --------------------------------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'sent',
      options: [
        { label: 'Sent', value: 'sent' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Read', value: 'read' },
        { label: 'Failed', value: 'failed' },
      ],
    },

    {
      name: 'readBy',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      admin: { description: 'Profiles who have read this message' },
    },

    /* ---------------------------------------------------------
     * MESSAGE REACTIONS
     --------------------------------------------------------- */
    {
      name: 'reactions',
      type: 'relationship',
      relationTo: 'message-reactions',
      hasMany: true,
    },

    /* ---------------------------------------------------------
     * MODERATION + TOXICITY AI
     --------------------------------------------------------- */
    {
      name: 'toxicityScore',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'AI toxicity score (0–1)',
      },
    },

    {
      name: 'isToxic',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'isFlagged',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Moderation flag' },
    },

    /* ---------------------------------------------------------
     * AUDIT
     --------------------------------------------------------- */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],
}
