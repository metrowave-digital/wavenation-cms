// src/collections/Profiles/profile.core.ts

import type { Field, FieldAccess } from 'payload'
import { isAdminRole } from '@/access/control'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Admin-only field
 */
const adminOnlyField: FieldAccess = ({ req }): boolean => Boolean(req?.user && isAdminRole(req))

/**
 * Profile owner OR Admin
 * (Profile collection already enforces ownership at collection level;
 * this is an extra guard against cross-profile updates.)
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

  if (!userProfile) return false

  return String(profileId) === String(userProfile)
}

/* ============================================================
   PROFILE CORE FIELDS
============================================================ */

export const profileCoreFields: Field[] = [
  /* ----------------------------------------------------------
     NAME / DISPLAY
  ---------------------------------------------------------- */
  {
    type: 'row',
    fields: [
      {
        name: 'firstName',
        type: 'text',
        admin: { width: '33%' },
        access: { update: selfOrAdminField },
      },
      {
        name: 'middleInitial',
        type: 'text',
        admin: { width: '10%' },
        access: { update: selfOrAdminField },
      },
      {
        name: 'lastName',
        type: 'text',
        admin: { width: '33%' },
        access: { update: selfOrAdminField },
      },
      {
        name: 'displayName',
        type: 'text',
        required: true,
        admin: {
          width: '24%',
          description: 'Public display name on WaveNation.',
        },
        access: { update: selfOrAdminField },
      },
    ],
  },

  /* ----------------------------------------------------------
     HANDLE / SLUG
     (Handle = user-controlled, Slug = system-generated)
  ---------------------------------------------------------- */
  {
    type: 'row',
    fields: [
      {
        name: 'handle',
        type: 'text',
        unique: true,
        index: true,
        admin: {
          width: '50%',
          description: '@handle for profiles and creator channels.',
        },
        access: { update: selfOrAdminField },
      },
      {
        name: 'slug',
        type: 'text',
        unique: true,
        index: true,
        admin: {
          width: '50%',
          description: 'Auto-generated if empty.',
          readOnly: true,
        },
        access: {
          update: adminOnlyField,
        },
      },
    ],
  },

  /* ----------------------------------------------------------
     MEDIA
  ---------------------------------------------------------- */
  {
    type: 'row',
    fields: [
      {
        name: 'avatar',
        type: 'upload',
        relationTo: 'media',
        admin: { width: '50%' },
        access: { update: selfOrAdminField },
      },
      {
        name: 'banner',
        type: 'upload',
        relationTo: 'media',
        admin: { width: '50%' },
        access: { update: selfOrAdminField },
      },
    ],
  },

  /* ----------------------------------------------------------
     BIO
  ---------------------------------------------------------- */
  {
    name: 'bio',
    type: 'textarea',
    access: { update: selfOrAdminField },
  },

  /* ----------------------------------------------------------
     LOCATION
  ---------------------------------------------------------- */
  {
    type: 'row',
    fields: [
      {
        name: 'city',
        type: 'text',
        admin: { width: '33%' },
        access: { update: selfOrAdminField },
      },
      {
        name: 'state',
        type: 'text',
        admin: { width: '33%' },
        access: { update: selfOrAdminField },
      },
      {
        name: 'country',
        type: 'text',
        admin: { width: '33%' },
        access: { update: selfOrAdminField },
      },
    ],
  },

  {
    name: 'timeZone',
    type: 'text',
    admin: { description: 'Optional preferred time zone.' },
    access: { update: selfOrAdminField },
  },

  /* ----------------------------------------------------------
     SOCIAL LINKS
  ---------------------------------------------------------- */
  {
    type: 'row',
    fields: [
      {
        name: 'website',
        type: 'text',
        admin: { width: '50%' },
        access: { update: selfOrAdminField },
      },
      {
        name: 'instagram',
        type: 'text',
        admin: { width: '50%' },
        access: { update: selfOrAdminField },
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'twitter',
        type: 'text',
        admin: { width: '50%' },
        access: { update: selfOrAdminField },
      },
      {
        name: 'tiktok',
        type: 'text',
        admin: { width: '50%' },
        access: { update: selfOrAdminField },
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'youtube',
        type: 'text',
        admin: { width: '50%' },
        access: { update: selfOrAdminField },
      },
      {
        name: 'facebook',
        type: 'text',
        admin: { width: '50%' },
        access: { update: selfOrAdminField },
      },
    ],
  },

  /* ----------------------------------------------------------
     PRIMARY ROLE (DISPLAY ONLY)
  ---------------------------------------------------------- */
  {
    name: 'primaryRole',
    type: 'select',
    defaultValue: 'listener',
    access: {
      update: adminOnlyField,
    },
    admin: {
      description: 'High-level display role (does not control permissions).',
    },
    options: [
      { label: 'Listener', value: 'listener' },
      { label: 'Artist', value: 'artist' },
      { label: 'Host / DJ', value: 'host' },
      { label: 'Creator', value: 'creator' },
      { label: 'Industry / Exec', value: 'industry' },
      { label: 'Editor / Critic', value: 'editor' },
    ],
  },
]
