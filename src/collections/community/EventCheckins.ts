import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'

export const EventCheckins: CollectionConfig = {
  slug: 'event-checkins',

  labels: {
    singular: 'Event Check-In',
    plural: 'Event Check-Ins',
  },

  admin: {
    group: 'Events & Tickets',
    useAsTitle: 'id',
    defaultColumns: ['event', 'user', 'method', 'createdAt'],
  },

  access: {
    /**
     * Who can *read* check-ins?
     * - admins + editors
     * - or optionally DJs/Host-DJs for radio/tv production
     */
    read: allowRoles(['admin', 'editor', 'host-dj']),

    /**
     * Who can *create* check-ins?
     * - admins + editors + host-djs (scan/validate at door or at broadcast)
     */
    create: allowRoles(['admin', 'editor', 'host-dj']),

    /**
     * Who can modify check-ins?
     */
    update: allowRoles(['admin']),

    /**
     * Who can delete check-ins?
     */
    delete: allowRoles(['admin']),
  },

  timestamps: true,

  fields: [
    /**
     * Registration ID (relationship to event-registrations)
     */
    {
      name: 'registration',
      type: 'relationship',
      relationTo: 'event-registrations',
      required: true,
      admin: {
        description: 'Which registration record does this check-in belong to?',
      },
    },

    /**
     * Polymorphic relationship:
     * event: { relationTo: "events" | "live-events"; value: number }
     */
    {
      name: 'event',
      type: 'relationship',
      relationTo: ['events', 'live-events'],
      required: true,
      admin: {
        description: 'The event this check-in is associated with.',
      },
    },

    /**
     * User who checked in
     */
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user who is attending the event.',
      },
    },

    /**
     * Method of check-in
     */
    {
      name: 'method',
      type: 'select',
      required: true,
      defaultValue: 'qr',
      options: [
        { label: 'QR Code Scan', value: 'qr' },
        { label: 'Manual (Admin / Staff)', value: 'manual' },
      ],
    },

    /**
     * Optional internal note
     */
    {
      name: 'note',
      type: 'textarea',
      admin: {
        description: 'Internal notes, e.g., VIP check-in, backstage, late arrival, etc.',
      },
    },

    /**
     * Optional: device or station that performed check-in
     */
    {
      name: 'scannedAtStation',
      type: 'text',
      admin: {
        description: 'Optional: Which station, door, or camera performed the scan.',
      },
    },
  ],

  /**
   * OPTIONAL: Automatically increment event metrics
   * When someone checks in, bump event.metrics.rsvpCount or event.metrics.attendanceCount
   */
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation !== 'create') return

        const event = doc.event
        if (!event?.relationTo || !event?.value) return

        // Auto-increment attendanceCount if your Events collection supports it
        try {
          await req.payload.update({
            collection: event.relationTo, // "events" or "live-events"
            id: event.value,
            data: {
              metrics: {
                attendanceCount: { increment: 1 },
              },
            },
          })
        } catch (e) {
          req.payload.logger.error(
            `[EventCheckins] Could not increment attendanceCount for event ${event.value}`,
          )
        }
      },
    ],
  },
}

export default EventCheckins
