import type { GlobalConfig } from 'payload'
import { allowRoles } from '@/access/control'

export const NavigationMenus: GlobalConfig = {
  slug: 'navigation-menus',
  label: 'Navigation Menus',

  access: {
    read: () => true, // Public fetch for web/mobile/TV apps
    update: allowRoles(['admin']), // Only admins modify
  },

  fields: [
    /* -------------------------------------------
     * HEADER MENU
     * ------------------------------------------- */
    {
      name: 'headerMenu',
      label: 'Header Menu',
      type: 'array',
      labels: {
        singular: 'Menu Item',
        plural: 'Menu Items',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },

        /* Icon (lucide name or media upload) */
        {
          name: 'icon',
          label: 'Icon (optional)',
          type: 'text',
          admin: {
            description: 'Use lucide icon name: e.g., "Home", "Music", "PlayCircle"',
          },
        },

        /* Optional badge: LIVE, NEW, HOT, EXCLUSIVE */
        {
          name: 'badge',
          type: 'select',
          label: 'Badge (optional)',
          options: [
            { label: 'None', value: 'none' },
            { label: 'LIVE', value: 'live' },
            { label: 'NEW', value: 'new' },
            { label: 'HOT', value: 'hot' },
            { label: 'EXCLUSIVE', value: 'exclusive' },
          ],
          defaultValue: 'none',
        },

        /* Visibility Options */
        {
          name: 'visibility',
          label: 'Visibility Rules',
          type: 'group',
          fields: [
            {
              name: 'hideOnWeb',
              type: 'checkbox',
              label: 'Hide on Web',
              defaultValue: false,
            },
            {
              name: 'hideOnMobile',
              type: 'checkbox',
              label: 'Hide on Mobile',
              defaultValue: false,
            },
            {
              name: 'hideOnTV',
              type: 'checkbox',
              label: 'Hide on TV Apps',
              defaultValue: false,
            },
            {
              name: 'requireAuth',
              type: 'checkbox',
              label: 'Only show to logged-in users',
              defaultValue: false,
            },
          ],
        },

        /* External Link Toggle */
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },

        /* Sort order */
        {
          name: 'order',
          type: 'number',
          label: 'Sort Order',
          defaultValue: 0,
        },

        /* Submenu (Mega Menu) */
        {
          name: 'submenu',
          label: 'Submenu (Optional)',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },

            /* Submenu icon */
            {
              name: 'icon',
              type: 'text',
              admin: {
                description: 'Optional lucide icon name',
              },
            },

            /* Optional description (for mega menu layouts) */
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Short description (used in mega menu)',
              },
            },

            /* Optional badge for submenu items */
            {
              name: 'badge',
              type: 'select',
              options: [
                { label: 'None', value: 'none' },
                { label: 'LIVE', value: 'live' },
                { label: 'NEW', value: 'new' },
                { label: 'HOT', value: 'hot' },
                { label: 'EXCLUSIVE', value: 'exclusive' },
              ],
              defaultValue: 'none',
            },

            /* Sort order for submenu */
            { name: 'order', type: 'number', defaultValue: 0 },
          ],
        },
      ],
    },

    /* -------------------------------------------
     * FOOTER MENU
     * ------------------------------------------- */
    {
      name: 'footerMenu',
      type: 'array',
      label: 'Footer Menu',
      labels: {
        singular: 'Footer Item',
        plural: 'Footer Items',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },

        /* External tab toggle */
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },

        /* Sort order */
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },

    /* -------------------------------------------
     * MOBILE MENU OVERRIDES (Optional)
     * Useful if your mobile menu differs from desktop
     * ------------------------------------------- */
    {
      name: 'mobileMenu',
      label: 'Mobile Menu (Optional)',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Optional lucide icon name',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          defaultValue: false,
        },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },

    /* -------------------------------------------
     * TV MENU (optional for Roku / FireTV / Apple TV)
     * ------------------------------------------- */
    {
      name: 'tvMenu',
      label: 'TV Menu',
      type: 'array',
      admin: {
        description: 'Used by Apple TV, Roku, FireTV navigation UI',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Optional TV icon name',
          },
        },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },
  ],
}
