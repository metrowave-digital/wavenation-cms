// src/collections/Users/Users.ts

import type { CollectionConfig, Access, AccessArgs, FieldAccess } from 'payload'

import { isAdminRole } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   COLLECTION ACCESS HELPERS
============================================================ */

/**
 * Admin OR same user (collection-level)
 */
const isAdminOrSelf: Access = ({ req, id }: AccessArgs): boolean => {
  if (!req?.user) return false
  if (isAdminRole(req)) return true
  if (!id) return false
  return String(req.user.id) === String(id)
}

/**
 * Admin only (collection-level)
 */
const isAdminOnly: Access = ({ req }): boolean => Boolean(req?.user && isAdminRole(req))

/**
 * Logged-in users
 */
const isLoggedIn: Access = ({ req }): boolean => Boolean(req?.user)

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Admin-only field update
 */
const adminOnlyField: FieldAccess = ({ req }): boolean => Boolean(req?.user && isAdminRole(req))

/**
 * Self OR Admin field update
 * (Field-safe: no id access)
 */
const selfOrAdminField: FieldAccess = ({ req, siblingData }): boolean => {
  if (!req?.user) return false
  if (isAdminRole(req)) return true

  /**
   * In Payload field access, siblingData represents
   * the SAME document being edited.
   * The user's own ID is accessible as siblingData.id
   */
  const ownerId = siblingData?.id
  if (!ownerId) return false

  return String(req.user.id) === String(ownerId)
}

/* ============================================================
   USERS COLLECTION
============================================================ */

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,

  admin: {
    useAsTitle: 'email',
    group: 'System',
    defaultColumns: ['email', 'roles', 'createdAt'],
  },

  access: {
    /**
     * Users may read themselves
     * Admins may read all
     */
    read: isAdminOrSelf,

    /**
     * Only admins may create users
     */
    create: isAdminOnly,

    /**
     * Users may update themselves
     * Admin override
     */
    update: isAdminOrSelf,

    /**
     * Only admins may delete users
     */
    delete: isAdminOnly,
  },

  timestamps: true,

  fields: [
    /* ======================================================
       ROLES (ADMIN ONLY)
    ====================================================== */
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: [Roles.FREE],
      access: {
        update: adminOnlyField,
      },
      admin: {
        description: 'Defines the user access level within WaveNation CMS.',
      },
      options: [
        { label: 'Free User', value: Roles.FREE },
        { label: 'Creator', value: Roles.CREATOR },
        { label: 'Pro Creator', value: Roles.PRO },
        { label: 'Host / DJ', value: Roles.HOST },
        { label: 'DJ', value: Roles.DJ },
        { label: 'VJ', value: Roles.VJ },
        { label: 'Industry', value: Roles.INDUSTRY },
        { label: 'Contributor', value: Roles.CONTRIBUTOR },
        { label: 'Editor', value: Roles.EDITOR },
        { label: 'Staff', value: Roles.STAFF },
        { label: 'Moderator', value: Roles.MODERATOR },
        { label: 'Admin', value: Roles.ADMIN },
        { label: 'Super Admin', value: Roles.SUPER_ADMIN },
        { label: 'System', value: Roles.SYSTEM },
      ],
    },

    /* ======================================================
       NAME
    ====================================================== */
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          access: {
            update: selfOrAdminField,
          },
        },
        {
          name: 'middleInitial',
          type: 'text',
          access: {
            update: selfOrAdminField,
          },
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          access: {
            update: selfOrAdminField,
          },
        },
      ],
    },

    /* ======================================================
       CONTACT
    ====================================================== */
    {
      name: 'dateOfBirth',
      type: 'date',
      access: {
        update: selfOrAdminField,
      },
    },
    {
      name: 'phone',
      type: 'text',
      access: {
        update: selfOrAdminField,
      },
    },

    /* ======================================================
       PROFILE LINK (SYSTEM CONTROLLED)
    ====================================================== */
    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
      admin: {
        readOnly: true,
      },
      access: {
        update: () => false,
      },
    },

    /* ======================================================
       TERMS (AUDIT SAFE)
    ====================================================== */
    {
      name: 'acceptTerms',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: {
        readOnly: true,
      },
      access: {
        update: () => false,
      },
    },
  ],
}

export default Users
