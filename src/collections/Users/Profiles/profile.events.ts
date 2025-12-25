// src/collections/Profiles/profile.events.ts

import type { Field, FieldAccess } from 'payload'
import { isAdminRole } from '@/access/control'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Admin-only update
 * (system-managed event & ticket graph)
 */
const adminOnlyField: FieldAccess = ({ req }): boolean => Boolean(req?.user && isAdminRole(req))

/**
 * Profile owner OR Admin (read visibility)
 */
const selfOrAdminRead: FieldAccess = ({ req, siblingData }): boolean => {
  if (!req?.user) return false
  if (isAdminRole(req)) return true

  const profileId = siblingData?.id
  if (!profileId) return false

  const userProfile =
    typeof (req.user as any)?.profile === 'string'
      ? (req.user as any).profile
      : (req.user as any)?.profile?.id

  return Boolean(userProfile && String(profileId) === String(userProfile))
}

/* ============================================================
   EVENT / TICKETING FIELDS (SYSTEM MANAGED)
============================================================ */

export const profileEventFields: Field[] = [
  /* ----------------------------------------------------------
     EVENTS ATTENDING (READ-ONLY)
  ---------------------------------------------------------- */
  {
    name: 'eventsAttending',
    type: 'relationship',
    relationTo: 'events',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Events this profile is attending.',
      readOnly: true,
    },
  },

  /* ----------------------------------------------------------
     EVENTS HOSTING (READ-ONLY)
  ---------------------------------------------------------- */
  {
    name: 'eventsHosting',
    type: 'relationship',
    relationTo: 'events',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Events hosted or organized by this profile.',
      readOnly: true,
    },
  },

  /* ----------------------------------------------------------
     TICKETS (READ-ONLY)
  ---------------------------------------------------------- */
  {
    name: 'tickets',
    type: 'relationship',
    relationTo: 'tickets',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Tickets owned by this profile.',
      readOnly: true,
    },
  },

  /* ----------------------------------------------------------
     EVENT PASSES (READ-ONLY)
  ---------------------------------------------------------- */
  {
    name: 'eventPasses',
    type: 'relationship',
    relationTo: 'event-passes',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Event passes associated with this profile.',
      readOnly: true,
    },
  },
]
