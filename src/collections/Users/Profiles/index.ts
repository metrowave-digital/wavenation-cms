// src/collections/Profiles/index.ts

import type { CollectionConfig, Access, AccessArgs, CollectionBeforeChangeHook } from 'payload'

import { isAdminRole } from '@/access/control'

/* ============================================================
   IMPORT SUB-FIELD GROUPS
============================================================ */
import { profileCoreFields } from './profile.core'
import { profileRoleFields } from './profile.roles'
import { profileCreatorFields } from './profile.creator'
import { profileInterestFields } from './profile.interests'
import { profileContentFields } from './profile.content'
import { profileSocialFields } from './profile.social'
import { profileEventFields } from './profile.events'
import { profileMessagingFields } from './profile.messaging'
import { profileNotificationFields } from './profile.notifications'
import { profileSystemFields } from './profile.system'

/* ============================================================
   ACCESS HELPERS (COLLECTION-LEVEL ONLY)
============================================================ */

/**
 * Admin only
 */
const isAdminAccess: Access = ({ req }) => Boolean(req?.user && isAdminRole(req))

/**
 * Admin OR profile owner
 */
const isAdminOrSelfProfile: Access = ({ req, id }: AccessArgs): boolean => {
  if (!req?.user || !id) return false

  // Admin override
  if (isAdminRole(req)) return true

  /**
   * The authenticated user's linked profile
   * (relationship stored on users collection)
   */
  const userProfile =
    typeof (req.user as any)?.profile === 'string'
      ? (req.user as any).profile
      : (req.user as any)?.profile?.id

  if (!userProfile) return false

  return String(userProfile) === String(id)
}

/* ============================================================
   BEFORE CHANGE HOOK
============================================================ */

const profilesBeforeChange: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  if (!data) return data

  /**
   * Audit fields
   */
  if (req?.user) {
    if (operation === 'create') {
      ;(data as any).createdBy = String(req.user.id)
    }
    ;(data as any).updatedBy = String(req.user.id)
  }

  /**
   * Slug generation (idempotent)
   */
  if (!data.slug) {
    const base =
      data.displayName ||
      [data.firstName, data.lastName].filter(Boolean).join(' ') ||
      (req.user as any)?.email ||
      ''

    if (base) {
      data.slug = base
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
  }

  return data
}

/* ============================================================
   PROFILES COLLECTION
============================================================ */

export const Profiles: CollectionConfig = {
  slug: 'profiles',

  admin: {
    useAsTitle: 'displayName',
    group: 'Users',
    defaultColumns: ['displayName', 'handle', 'primaryRole', 'location'],
  },

  access: {
    /**
     * Public read (profiles are discoverable)
     */
    read: () => true,

    /**
     * Any logged-in user may create a profile
     * (usually created automatically at signup)
     */
    create: ({ req }) => Boolean(req?.user),

    /**
     * Owner or Admin may update
     */
    update: isAdminOrSelfProfile,

    /**
     * Admin-only delete
     */
    delete: isAdminAccess,
  },

  timestamps: true,

  fields: [
    {
      type: 'tabs',
      tabs: [
        { label: 'Core', fields: profileCoreFields },
        { label: 'Roles & Flags', fields: profileRoleFields },
        { label: 'Creator & Channels', fields: profileCreatorFields },
        { label: 'Interests', fields: profileInterestFields },
        { label: 'Content Library', fields: profileContentFields },
        { label: 'Social & Following', fields: profileSocialFields },
        { label: 'Events & Tickets', fields: profileEventFields },
        { label: 'Messaging', fields: profileMessagingFields },
        { label: 'Notifications', fields: profileNotificationFields },
        { label: 'System', fields: profileSystemFields },
      ],
    },
  ],

  hooks: {
    beforeChange: [profilesBeforeChange],
  },
}

export default Profiles
