import type { CollectionConfig, Access } from 'payload'

/* ---------------------------------------
 * ACCESS CONTROL
 * --------------------------------------- */

const canReadNotifications: Access = ({ req }) => {
  if (!req.user) return false

  // Admins see all notifications
  if (req.user.role === 'admin') return true

  // Regular users can only read their own notifications
  return {
    user: { equals: req.user.id },
  }
}

/* ---------------------------------------
 * COLLECTION
 * --------------------------------------- */

export const Notifications: CollectionConfig = {
  slug: 'notifications',

  labels: {
    singular: 'Notification',
    plural: 'Notifications',
  },

  admin: {
    group: 'Social',
    defaultColumns: ['user', 'actor', 'type', 'isRead', 'createdAt'],
    description: 'System-wide activity & social notifications.',
  },

  access: {
    read: canReadNotifications,
    create: ({ req }) => !!req.user, // system/internal use
    update: ({ req }) => !!req.user, // user can mark read
    delete: ({ req }) => req.user?.role === 'admin', // only admins delete
  },

  fields: [
    /* ---------------------------------------
     * WHO RECEIVES THE NOTIFICATION?
     * --------------------------------------- */
    {
      name: 'user',
      label: 'Recipient',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    /* ---------------------------------------
     * WHO TRIGGERED THE ACTION?
     * (User who followed, liked, commented, etc.)
     * --------------------------------------- */
    {
      name: 'actor',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    /* ---------------------------------------
     * WHAT THE NOTIFICATION IS ABOUT
     * Can reference a user, channel, show, podcast,
     * or any content type.
     * --------------------------------------- */
    {
      name: 'target',
      type: 'relationship',
      relationTo: [
        'users',
        'creator-channels',
        'shows',
        'podcasts',
        'posts',
        'videos',
        'tracks',
        'podcast-episodes',
        'series',
      ],
      required: false,
    },

    /* ---------------------------------------
     * TYPE OF NOTIFICATION
     * --------------------------------------- */
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Follow', value: 'follow' },
        { label: 'Like', value: 'like' },
        { label: 'Comment', value: 'comment' },
        { label: 'Message', value: 'message' },
        { label: 'Post', value: 'post' },
        { label: 'Announcement', value: 'announcement' },
        { label: 'Episode Update', value: 'episode' },
        { label: 'System Notice', value: 'system' },
      ],
    },

    /* ---------------------------------------
     * OPTIONAL HUMAN-READABLE COPY
     * --------------------------------------- */
    {
      name: 'content',
      type: 'textarea',
      admin: {
        description: 'Optional message text displayed to the user.',
      },
    },

    /* ---------------------------------------
     * READ STATUS
     * --------------------------------------- */
    {
      name: 'isRead',
      type: 'checkbox',
      defaultValue: false,
    },

    /* ---------------------------------------
     * OPTIONAL SOURCE REFERENCES
     * Helps you fetch exact related content.
     * --------------------------------------- */
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
    },
    {
      name: 'comment',
      type: 'relationship',
      relationTo: 'comments',
    },
    {
      name: 'message',
      type: 'relationship',
      relationTo: 'messages',
    },
  ],
}
