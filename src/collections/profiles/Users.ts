// src/collections/Users.ts
import type { CollectionConfig } from 'payload'
import { ROLE_LIST } from '../../access/roles'
import { isAdmin, allowIfSelfOrAdmin } from '@/access/control'
import { generateUsername } from '@/hooks/generateUsername'
import { syncSubscription } from '@/hooks/syncSubscription'

export const Users: CollectionConfig = {
  slug: 'users',

  // Keep Payload auth ON — primary identity + admin login
  auth: true,

  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      'email',
      'role',
      'firstName',
      'lastName',
      'username',
      'creatorType',
      'creatorModeEnabled',
      'subscription.status',
      'verified.status',
    ],
    group: 'System',
  },

  access: {
    read: isAdmin,
    create: isAdmin,
    update: allowIfSelfOrAdmin,
    delete: isAdmin,
  },

  hooks: {
    beforeChange: [generateUsername],
    afterChange: [syncSubscription],
  },

  fields: [
    /* ----------------------------------------------
     * BASIC INFO
     * ---------------------------------------------- */
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'username',
      type: 'text',
      unique: true,
      admin: { placeholder: 'Auto-generated if empty' },
      saveToJWT: true,
    },
    {
      name: 'displayName',
      type: 'text',
      admin: {
        description: 'Shown publicly across WaveNation. Defaults to "First Last" if empty.',
      },
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },

    /* ----------------------------------------------
     * AUTH PROVIDER / AUTH0 BRIDGE
     * ---------------------------------------------- */
    {
      name: 'authProvider',
      type: 'group',
      admin: {
        position: 'sidebar',
        description: 'Authentication provider metadata.',
      },
      fields: [
        {
          name: 'provider',
          type: 'select',
          defaultValue: 'local',
          options: [
            { label: 'Local (Payload)', value: 'local' },
            { label: 'Auth0', value: 'auth0' },
          ],
          saveToJWT: true,
        },
        {
          name: 'auth0Id',
          type: 'text',
          unique: true,
          admin: {
            description:
              'Auth0 user sub (e.g. auth0|xxxx). Used when Auth0 is the primary identity.',
          },
          saveToJWT: true,
        },
        {
          name: 'lastLoginProvider',
          type: 'select',
          options: [
            { label: 'Local', value: 'local' },
            { label: 'Auth0', value: 'auth0' },
          ],
        },
      ],
    },

    /* ----------------------------------------------
     * VERIFICATION
     * ---------------------------------------------- */
    {
      name: 'verified',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        {
          name: 'status',
          type: 'select',
          defaultValue: 'unverified',
          options: [
            { label: 'Unverified', value: 'unverified' },
            { label: 'Pending Review', value: 'pending' },
            { label: 'Verified Creator', value: 'verified' },
            { label: 'Flagged', value: 'flagged' },
          ],
        },
        {
          name: 'badge',
          type: 'checkbox',
          label: 'Display Verified Badge?',
          defaultValue: false,
        },
        {
          name: 'notes',
          type: 'textarea',
        },
        {
          name: 'reviewedBy',
          type: 'relationship',
          relationTo: 'users',
        },
      ],
    },

    {
      name: 'isOnline',
      type: 'checkbox',
      defaultValue: false,
    },

    /* ----------------------------------------------
     * ROLES
     * ---------------------------------------------- */
    {
      name: 'role',
      type: 'select',
      options: ROLE_LIST.map((r) => ({ label: r, value: r })),
      required: true,
      defaultValue: 'contributor',
      admin: { position: 'sidebar' },
      saveToJWT: true,
    },

    /* ----------------------------------------------
     * PLATFORM CREATOR MODE
     * ---------------------------------------------- */
    {
      name: 'creatorModeEnabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Unlocks creator-facing tools and analytics.',
      },
    },
    {
      name: 'creatorTier',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Rising', value: 'rising' },
        { label: 'Pro', value: 'pro' },
        { label: 'Premier', value: 'premier' },
      ],
    },

    {
      name: 'creatorType',
      type: 'select',
      defaultValue: 'none',
      admin: { position: 'sidebar' },
      options: [
        { label: 'None', value: 'none' },
        { label: 'Radio DJ / Host', value: 'dj' },
        { label: 'TV Host / Presenter', value: 'tv-host' },
        { label: 'Podcaster', value: 'podcaster' },
        { label: 'Artist / Music Artist', value: 'artist' },
        { label: 'Filmmaker', value: 'filmmaker' },
        { label: 'Writer / Journalist', value: 'writer' },
        { label: 'Content Creator', value: 'creator' },
      ],
    },
    {
      name: 'creatorBio',
      type: 'textarea',
    },

    /* VISUAL BRANDING */
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bannerImage',
      type: 'upload',
      relationTo: 'media',
    },

    /* LINKS */
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'x', type: 'text', label: 'X (formerly Twitter)' },
        { name: 'tiktok', type: 'text' },
        { name: 'youtube', type: 'text' },
        { name: 'soundcloud', type: 'text' },
      ],
    },

    /* ----------------------------------------------
     * SOCIAL GRAPH (SUMMARY)
     * ---------------------------------------------- */
    {
      name: 'linkedProfile',
      type: 'relationship',
      relationTo: 'profiles',
      admin: {
        description: 'Primary public profile for this user across WaveNation apps.',
      },
    },
    {
      name: 'socialStats',
      type: 'group',
      admin: {
        description: 'Cached social stats for fast UI. Can be updated by background jobs.',
      },
      fields: [
        { name: 'followersCount', type: 'number', defaultValue: 0 },
        { name: 'followingCount', type: 'number', defaultValue: 0 },
        { name: 'postsCount', type: 'number', defaultValue: 0 },
        { name: 'reactionsCount', type: 'number', defaultValue: 0 },
        { name: 'unreadNotifications', type: 'number', defaultValue: 0 },
      ],
    },

    /* ----------------------------------------------
     * USER FAVORITES SUMMARY
     * ---------------------------------------------- */
    {
      name: 'favoritesCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Total number of favorite items.',
      },
    },
    {
      name: 'favoriteStats',
      type: 'group',
      admin: {
        description: 'Cached per-category favorite counts.',
        position: 'sidebar',
      },
      fields: [
        { name: 'posts', type: 'number', defaultValue: 0 },
        { name: 'videos', type: 'number', defaultValue: 0 },
        { name: 'tracks', type: 'number', defaultValue: 0 },
        { name: 'playlists', type: 'number', defaultValue: 0 },
        { name: 'albums', type: 'number', defaultValue: 0 },
        { name: 'shows', type: 'number', defaultValue: 0 },
        { name: 'episodes', type: 'number', defaultValue: 0 },
        { name: 'vod', type: 'number', defaultValue: 0 },
        { name: 'live', type: 'number', defaultValue: 0 },
      ],
    },
    {
      name: 'favorites',
      type: 'relationship',
      relationTo: 'user-favorites',
      hasMany: true,
      admin: {
        readOnly: true,
        description: 'All favorites created by this user.',
      },
    },

    /* ----------------------------------------------
     * SOCIAL SETTINGS
     * ---------------------------------------------- */
    {
      name: 'socialSettings',
      type: 'group',
      admin: { description: 'Controls for followers, messaging, privacy, and safety.' },
      fields: [
        {
          name: 'profileVisibility',
          type: 'select',
          defaultValue: 'public',
          options: [
            { label: 'Public', value: 'public' },
            { label: 'Followers Only', value: 'followers' },
            { label: 'Private', value: 'private' },
          ],
        },
        {
          name: 'allowDmsFrom',
          type: 'select',
          defaultValue: 'followers',
          options: [
            { label: 'Everyone', value: 'everyone' },
            { label: 'Followers Only', value: 'followers' },
            { label: 'No One', value: 'no-one' },
          ],
        },
        {
          name: 'enableTagging',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'sensitiveContentFilter',
          type: 'select',
          defaultValue: 'standard',
          options: [
            { label: 'Off', value: 'off' },
            { label: 'Standard', value: 'standard' },
            { label: 'Strict', value: 'strict' },
          ],
        },
      ],
    },

    /* ----------------------------------------------
     * SUBSCRIPTION STATUS
     * ---------------------------------------------- */
    {
      name: 'subscription',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        {
          name: 'plan',
          type: 'relationship',
          relationTo: 'paid-subscriptions',
        },
        { name: 'provider', type: 'text', admin: { readOnly: true } },
        { name: 'status', type: 'text', admin: { readOnly: true } },
        { name: 'providerCustomerId', type: 'text' },
        { name: 'providerSubscriptionId', type: 'text' },
        { name: 'currentPeriodStart', type: 'date' },
        { name: 'currentPeriodEnd', type: 'date' },
        {
          name: 'cancelAtPeriodEnd',
          type: 'checkbox',
          defaultValue: false,
          required: true,
        },
        { name: 'canceledAt', type: 'date' },
        { name: 'nextBillingAttempt', type: 'date' },
        { name: 'renewalDate', type: 'date' },
        { name: 'daysRemaining', type: 'number' },
      ],
    },

    /* ----------------------------------------------
     * RELATIONSHIPS TO CONTENT
     * ---------------------------------------------- */
    {
      name: 'linkedShows',
      type: 'relationship',
      relationTo: 'shows',
      hasMany: true,
    },
    {
      name: 'linkedEpisodes',
      type: 'relationship',
      relationTo: 'episodes',
      hasMany: true,
    },
    {
      name: 'linkedPlaylists',
      type: 'relationship',
      relationTo: 'playlists',
      hasMany: true,
    },

    /* ----------------------------------------------
     * NOTIFICATION SETTINGS
     * ---------------------------------------------- */
    {
      name: 'notifications',
      type: 'group',
      fields: [
        { name: 'emailUpdates', type: 'checkbox', defaultValue: true, required: true },
        { name: 'newFollowers', type: 'checkbox', defaultValue: true, required: true },
        { name: 'comments', type: 'checkbox', defaultValue: true, required: true },
        { name: 'mentions', type: 'checkbox', defaultValue: true, required: true },
        { name: 'directMessages', type: 'checkbox', defaultValue: true, required: true },
      ],
    },

    /* ----------------------------------------------
     * PLATFORM AVAILABILITY
     * ---------------------------------------------- */
    {
      name: 'platformAccess',
      label: 'Platform Access',
      type: 'select',
      hasMany: true,
      defaultValue: ['web'],
      admin: { position: 'sidebar' },
      options: [
        { label: 'Web', value: 'web' },
        { label: 'Mobile App', value: 'mobile' },
        { label: 'Apple TV', value: 'apple_tv' },
        { label: 'Roku', value: 'roku' },
        { label: 'Fire TV', value: 'fire_tv' },
      ],
    },

    /* ----------------------------------------------
     * GEO / AGE COMPLIANCE DEFAULTS
     * ---------------------------------------------- */
    {
      name: 'complianceDefaults',
      type: 'group',
      admin: { description: 'Default restrictions for uploads.' },
      fields: [
        {
          name: 'countryRestrictions',
          type: 'array',
          fields: [{ name: 'country', type: 'text' }],
        },
        {
          name: 'defaultAgeRating',
          type: 'select',
          options: [
            'G',
            'PG',
            'PG-13',
            'R',
            'NC-17',
            'TV-Y',
            'TV-G',
            'TV-PG',
            'TV-14',
            'TV-MA',
          ].map((r) => ({ value: r, label: r })),
        },
        {
          name: 'defaultContentWarnings',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Violence', value: 'violence' },
            { label: 'Nudity', value: 'nudity' },
            { label: 'Language', value: 'language' },
            { label: 'Substance Use', value: 'substance' },
            { label: 'Flashing Lights', value: 'flashing' },
          ],
        },
      ],
    },

    /* ----------------------------------------------
     * SECURITY & AUTH
     * ---------------------------------------------- */
    {
      name: 'twoFactorEnabled',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'twoFactorMethod',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Authenticator App', value: 'auth-app' },
        { label: 'SMS', value: 'sms' },
        { label: 'Email Code', value: 'email' },
      ],
      defaultValue: 'none',
    },
    {
      name: 'authAppSecret',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Secret key used for authenticator apps (TOTP).',
      },
    },
    {
      name: 'recoveryEmail',
      type: 'text',
    },
    {
      name: 'trustedDevices',
      type: 'array',
      admin: { readOnly: true },
      fields: [
        { name: 'deviceId', type: 'text' },
        { name: 'addedAt', type: 'date' },
      ],
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Phone number used for SMS-based 2FA.',
      },
    },
    {
      name: 'pendingSmsCode',
      type: 'text',
    },
    {
      name: 'pendingSmsExpiresAt',
      type: 'date',
    },
    {
      name: 'pendingEmailCode',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'isLocked',
      type: 'checkbox',
      defaultValue: false,
      required: true,
    },
    {
      name: 'isSuspended',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      saveToJWT: true,
    },
    {
      name: 'lockoutCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'failedLoginAttempts',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'lastFailedLogin',
      type: 'date',
    },
    {
      name: 'suspendedUntil',
      type: 'date',
    },
    {
      name: 'lastLogin',
      type: 'date',
      admin: {
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Pending Review', value: 'pending' },
      ],
      defaultValue: 'active',
      saveToJWT: true,
    },

    /* ----------------------------------------------
     * LOGIN HISTORY (AUDIT LOG)
     * ---------------------------------------------- */
    {
      name: 'loginHistory',
      type: 'array',
      admin: { readOnly: true, description: 'Security login audit log' },
      fields: [
        { name: 'timestamp', type: 'text' },
        { name: 'ip', type: 'text' },
        { name: 'userAgent', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'region', type: 'text' },
        { name: 'country', type: 'text' },
        { name: 'device', type: 'text' },
      ],
    },

    {
      name: 'sessionVersion',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Increment to revoke all active sessions',
      },
      saveToJWT: true,
    },

    {
      name: 'isBanned',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'If enabled, the user is banned from posting or interacting.',
      },
      saveToJWT: true,
    },
  ],
}

export default Users
