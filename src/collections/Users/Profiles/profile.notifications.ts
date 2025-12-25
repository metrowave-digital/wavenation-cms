// src/collections/Profiles/profile.notifications.ts

import type { Field, FieldAccess } from 'payload'
import { isAdminRole } from '@/access/control'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Profile owner OR Admin
 * (Preferences & consent)
 */
const selfOrAdminField: FieldAccess = ({ req, siblingData }): boolean => {
  if (!req?.user) return false
  if (isAdminRole(req)) return true

  const profileId = siblingData?.id
  if (!profileId) return false

  const userProfile =
    typeof (req.user as any)?.profile === 'string'
      ? (req.user as any).profile
      : (req.user as any)?.profile?.id

  return Boolean(userProfile && String(profileId) === String(profileId))
}

/**
 * System-only fields
 * (Delivery + history)
 */
const systemOnlyField: FieldAccess = () => false

/* ============================================================
   NOTIFICATION & COMMUNICATION FIELDS
============================================================ */

export const profileNotificationFields: Field[] = [
  /* ==========================================================
     1️⃣ NOTIFICATION RULES (SYSTEM MANAGED)
     (Routing, priority, triggers)
  ========================================================== */
  {
    name: 'notificationRules',
    type: 'relationship',
    relationTo: 'notification-rules',
    hasMany: true,
    access: {
      read: selfOrAdminField,
      update: systemOnlyField,
    },
    admin: {
      description: 'System-defined rules controlling when and how notifications are generated.',
      readOnly: true,
    },
  },

  /* ==========================================================
     2️⃣ NOTIFICATION HISTORY (SYSTEM MANAGED)
     (Audit + inbox)
  ========================================================== */
  {
    name: 'notifications',
    type: 'relationship',
    relationTo: 'notifications',
    hasMany: true,
    access: {
      read: selfOrAdminField,
      update: systemOnlyField,
    },
    admin: {
      description: 'Notification history delivered to this profile.',
      readOnly: true,
    },
  },

  /* ==========================================================
     3️⃣ USER NOTIFICATION PREFERENCES (EXPLICIT CONSENT)
  ========================================================== */
  {
    name: 'notificationPreferences',
    type: 'group',
    access: { update: selfOrAdminField },
    admin: {
      description: 'User-controlled notification delivery and consent preferences.',
    },
    fields: [
      /* ------------------------------------------------------
         CHANNEL ENABLEMENT
      ------------------------------------------------------ */
      {
        type: 'row',
        fields: [
          {
            name: 'emailEnabled',
            type: 'checkbox',
            defaultValue: true,
            admin: { description: 'Allow email notifications.' },
          },
          {
            name: 'pushEnabled',
            type: 'checkbox',
            defaultValue: true,
            admin: { description: 'Allow push notifications.' },
          },
          {
            name: 'smsEnabled',
            type: 'checkbox',
            defaultValue: false,
            admin: { description: 'Allow SMS notifications.' },
          },
          {
            name: 'inAppEnabled',
            type: 'checkbox',
            defaultValue: true,
            admin: { description: 'Allow in-app notifications.' },
          },
        ],
      },

      /* ------------------------------------------------------
         CATEGORY PREFERENCES
      ------------------------------------------------------ */
      {
        name: 'categories',
        type: 'select',
        hasMany: true,
        admin: {
          description: 'Which types of notifications this user wants to receive.',
        },
        options: [
          { label: 'New Followers', value: 'follows' },
          { label: 'Comments & Replies', value: 'comments' },
          { label: 'Likes & Reactions', value: 'reactions' },
          { label: 'Creator Channel Posts', value: 'channel_posts' },
          { label: 'Live Stream Alerts', value: 'livestreams' },
          { label: 'Event Updates', value: 'events' },
          { label: 'Recommendations & Discover', value: 'recommendations' },
          { label: 'Platform Announcements', value: 'system' },
        ],
      },

      /* ------------------------------------------------------
         FREQUENCY & QUIET HOURS (ENTERPRISE GRADE)
      ------------------------------------------------------ */
      {
        name: 'deliveryControls',
        type: 'group',
        admin: {
          description: 'Controls notification frequency and quiet periods.',
        },
        fields: [
          {
            name: 'frequency',
            type: 'select',

            // ✅ THIS IS THE FIX — explicit Postgres enum name
            enumName: 'profile_notif_freq',

            defaultValue: 'realtime',
            options: [
              { label: 'Real-time', value: 'realtime' },
              { label: 'Daily Digest', value: 'daily' },
              { label: 'Weekly Digest', value: 'weekly' },
            ],
          },
          {
            type: 'row',
            fields: [
              {
                name: 'quietHoursStart',
                type: 'text',
                admin: {
                  width: '50%',
                  description: 'Start of quiet hours (HH:mm).',
                },
              },
              {
                name: 'quietHoursEnd',
                type: 'text',
                admin: {
                  width: '50%',
                  description: 'End of quiet hours (HH:mm).',
                },
              },
            ],
          },
        ],
      },

      /* ------------------------------------------------------
         COMPLIANCE & CONSENT METADATA
      ------------------------------------------------------ */
      {
        name: 'consentMetadata',
        type: 'group',
        admin: {
          description: 'Consent and compliance tracking (GDPR / CAN-SPAM).',
          readOnly: true,
        },
        fields: [
          {
            name: 'lastUpdatedAt',
            type: 'date',
          },
          {
            name: 'lastUpdatedBy',
            type: 'text',
          },
        ],
      },
    ],
  },
]
