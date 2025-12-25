import type { CollectionConfig } from 'payload'
import { isStaffAccess } from '@/access/control'

export const ChatMedia: CollectionConfig = {
  slug: 'chat-media',

  admin: {
    useAsTitle: 'filename',
    group: 'Communications',
  },

  upload: {
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
  },

  access: {
    read: ({ req }) => Boolean(req?.user),
    create: ({ req }) => Boolean(req?.user),
    update: () => false,
    delete: ({ req }) => Boolean(req?.user?.roles?.includes('admin')),
  },

  /* ============================================================
     HOOKS — CHAT RULE ENFORCEMENT
  ============================================================ */
  hooks: {
    beforeChange: [
      async ({ req, data, operation, req: { payload } }) => {
        if (!req?.user) return data

        // Auto-set sender (prevent spoofing)
        if (operation === 'create') {
          data.sender = data.sender || req.user.id
        }

        // Fetch chat to enforce rules
        if (operation === 'create' && data.chat) {
          const chat = await payload.findByID({
            collection: 'chats',
            id: data.chat,
          })

          // Block uploads to locked chats (unless staff)
          if (chat.isLocked && !isStaffAccess({ req })) {
            throw new Error('This chat is locked.')
          }

          // Enforce membership
          const memberIds = (chat.members || []).map((m: any) => (typeof m === 'object' ? m.id : m))

          if (!memberIds.includes(String(req.user.id)) && !isStaffAccess({ req })) {
            throw new Error('You are not a member of this chat.')
          }
        }

        return data
      },
    ],
  },

  fields: [
    /* ---------------------------------------------------------
     * RELATIONSHIPS
     --------------------------------------------------------- */
    {
      name: 'chat',
      type: 'relationship',
      relationTo: 'chats',
      required: true,
      access: { update: () => false },
    },

    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      access: { update: () => false },
    },

    /* ---------------------------------------------------------
     * METADATA
     --------------------------------------------------------- */
    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'metadata',
      type: 'json',
    },
  ],
}
