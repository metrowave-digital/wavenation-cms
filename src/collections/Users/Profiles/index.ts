import type { CollectionConfig, AccessArgs, CollectionBeforeChangeHook } from 'payload'

/* ============================================================
   IMPORT SUB-FIELD GROUPS (each must export Field[])
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
   ACCESS HELPERS
============================================================ */

const getUserRoles = (req: AccessArgs['req']): string[] =>
  Array.isArray((req.user as any)?.roles) ? ((req.user as any).roles as string[]) : []

const isAdmin = ({ req }: AccessArgs): boolean => {
  const roles = getUserRoles(req)
  return (
    roles.includes('admin') ||
    roles.includes('super-admin') ||
    roles.includes('system')
  )
}

const isAdminOrSelfProfile = ({ req, id }: AccessArgs): boolean => {
  if (!req.user) return false
  const roles = getUserRoles(req)

  // Admin-like roles always allowed
  if (roles.includes('admin') || roles.includes('super-admin') || roles.includes('system')) {
    return true
  }

  // Profile-level ownership check
  const userProfileId = (req.user as any)?.profile
  return Boolean(userProfileId && id && String(userProfileId) === String(id))
}

/* ============================================================
   BEFORE CHANGE HOOK
============================================================ */

const profilesBeforeChange: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  if (!data) return data

  // Creator/updater
  if (req.user) {
    if (operation === 'create') {
      ;(data as any).createdBy = req.user.id
    }
    ;(data as any).updatedBy = req.user.id
  }

  // Slug generation
  if (!data.slug) {
    const base =
      data.displayName ||
      [data.firstName, data.lastName].filter(Boolean).join(' ') ||
      (req.user as any)?.email ||
      ''

    if (base) {
      data.slug = base
        .toLowerCase()
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
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: isAdminOrSelfProfile,
    delete: isAdmin,
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
