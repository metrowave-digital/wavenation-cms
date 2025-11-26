import type { GlobalConfig } from 'payload'
import { isAdmin, publicRead } from '@/access/control'

export const GlobalSettings: GlobalConfig = {
  slug: 'global-settings',

  label: 'Global Settings',

  access: {
    read: publicRead,
    update: isAdmin, // Only admins can update
  },

  fields: [
    /* -------------------------------------------
     * BRANDING + THEME TOKENS
     * ------------------------------------------- */
    {
      name: 'branding',
      label: 'Branding',
      type: 'group',
      fields: [
        { name: 'primaryColor', type: 'text', label: 'Primary Color (HEX)' },
        { name: 'secondaryColor', type: 'text', label: 'Secondary Color (HEX)' },
        { name: 'accentColor', type: 'text', label: 'Accent Color (HEX)' },

        {
          name: 'logoLight',
          label: 'Logo (Light Theme)',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'logoDark',
          label: 'Logo (Dark Theme)',
          type: 'upload',
          relationTo: 'media',
        },

        // App icons
        {
          name: 'appIconSquare',
          label: 'App Icon (Square)',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'appIconRound',
          label: 'App Icon (Round)',
          type: 'upload',
          relationTo: 'media',
        },

        // TV + web hero banners
        {
          name: 'heroBanner',
          label: 'Hero Banner Image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    /* -------------------------------------------
     * STREAMING ENDPOINTS (RADIO, TV, EVENTS)
     * ------------------------------------------- */
    {
      name: 'streaming',
      label: 'Streaming Endpoints',
      type: 'group',
      fields: [
        { name: 'radioStream', type: 'text', label: 'Radio Stream URL' },
        { name: 'radioBackupStream', type: 'text', label: 'Radio Backup Stream URL' },
        { name: 'tvStream', type: 'text', label: 'TV Stream URL' },
        { name: 'tvBackupStream', type: 'text', label: 'TV Backup Stream URL' },
        { name: 'liveEventsStream', type: 'text', label: 'Live Events Stream URL' },

        {
          name: 'showNowPlaying',
          label: 'Show Now Playing Widget',
          type: 'checkbox',
          defaultValue: true,
        },

        {
          name: 'automationFallbackPlaylist',
          label: 'Automation Fallback Playlist',
          type: 'relationship',
          relationTo: 'playlists',
          admin: {
            description: 'Playlist used when no scheduled show is active.',
          },
        },
      ],
    },

    /* -------------------------------------------
     * SOCIAL LINKS (WEB + MOBILE + TV)
     * ------------------------------------------- */
    {
      name: 'socialLinks',
      label: 'Social & App Links',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text', label: 'Instagram URL' },
        { name: 'facebook', type: 'text', label: 'Facebook URL' },
        { name: 'twitterX', type: 'text', label: 'X (Twitter) URL' },
        { name: 'youtube', type: 'text', label: 'YouTube URL' },
        { name: 'tiktok', type: 'text', label: 'TikTok URL' },
        { name: 'threads', type: 'text', label: 'Threads URL' },

        // App stores
        { name: 'appStoreiOS', type: 'text', label: 'iOS App Store URL' },
        { name: 'googlePlay', type: 'text', label: 'Google Play Store URL' },
        { name: 'rokuChannel', type: 'text', label: 'Roku Channel URL' },
        { name: 'appleTVApp', type: 'text', label: 'Apple TV App URL' },
        { name: 'fireTVApp', type: 'text', label: 'Fire TV App URL' },
      ],
    },

    /* -------------------------------------------
     * CONTACT
     * ------------------------------------------- */
    {
      name: 'contact',
      label: 'Contact Information',
      type: 'group',
      fields: [
        { name: 'email', type: 'text', label: 'Main Contact Email' },
        { name: 'phone', type: 'text', label: 'Main Phone Number' },
        { name: 'address', type: 'textarea', label: 'Mailing / Studio Address' },
      ],
    },

    /* -------------------------------------------
     * SITE-WIDE ANNOUNCEMENT BANNER
     * ------------------------------------------- */
    {
      name: 'announcementBanner',
      label: 'Announcement Banner',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Banner',
        },
        { name: 'message', type: 'text', label: 'Banner Message' },
        {
          name: 'type',
          type: 'select',
          label: 'Banner Type',
          defaultValue: 'info',
          options: [
            { label: 'Info', value: 'info' },
            { label: 'Warning', value: 'warning' },
            { label: 'Alert', value: 'alert' },
            { label: 'Event', value: 'event' },
            { label: 'System', value: 'system' },
          ],
        },
      ],
    },

    /* -------------------------------------------
     * EMERGENCY OVERRIDE BANNER (EAS-style)
     * ------------------------------------------- */
    {
      name: 'emergencyOverride',
      label: 'Emergency Override Banner',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Emergency Override',
        },
        { name: 'title', type: 'text', label: 'Override Title' },
        { name: 'description', type: 'textarea', label: 'Override Description' },
        {
          name: 'priority',
          type: 'select',
          label: 'Priority Level',
          options: [
            { label: 'Critical', value: 'critical' },
            { label: 'Severe', value: 'severe' },
          ],
        },
      ],
    },

    /* -------------------------------------------
     * HEADER + FOOTER LINKS
     * ------------------------------------------- */
    {
      name: 'navigation',
      label: 'Navigation',
      type: 'group',
      fields: [
        {
          name: 'headerLinks',
          label: 'Header Links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', label: 'Label' },
            { name: 'url', type: 'text', label: 'URL' },
          ],
        },
        {
          name: 'footerLinks',
          label: 'Footer Links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', label: 'Label' },
            { name: 'url', type: 'text', label: 'URL' },
          ],
        },
      ],
    },

    /* -------------------------------------------
     * DEFAULT SEO (WEB + APP)
     * ------------------------------------------- */
    {
      name: 'defaultSEO',
      label: 'Default SEO',
      type: 'group',
      fields: [
        { name: 'siteName', type: 'text', label: 'Site Name' },
        { name: 'defaultTitle', type: 'text', label: 'Default Meta Title' },
        { name: 'defaultDescription', type: 'textarea', label: 'Default Meta Description' },
        {
          name: 'defaultImage',
          label: 'Default Share Image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    /* -------------------------------------------
     * APP VERSIONING (Mobile + TV)
     * ------------------------------------------- */
    {
      name: 'appVersion',
      label: 'App Versions',
      type: 'group',
      fields: [
        { name: 'ios', type: 'text', label: 'iOS Version' },
        { name: 'android', type: 'text', label: 'Android Version' },
        { name: 'roku', type: 'text', label: 'Roku Version' },
        { name: 'fireTV', type: 'text', label: 'Fire TV Version' },
        { name: 'appleTV', type: 'text', label: 'Apple TV Version' },
      ],
    },

    /* -------------------------------------------
     * ADS & PRE-ROLL SETTINGS (Audio/Video)
     * ------------------------------------------- */
    {
      name: 'ads',
      label: 'Ad Configuration (Audio/Video Assets)',
      type: 'group',
      fields: [
        {
          name: 'radioPrerollAd',
          label: 'Radio Preroll Audio',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'tvPrerollAd',
          label: 'TV Preroll Video',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'videoPrerollAd',
          label: 'On-Demand Video Preroll',
          type: 'upload',
          relationTo: 'media',
        },

        {
          name: 'adFrequencyMinutes',
          label: 'Default Ad Frequency (Minutes)',
          type: 'number',
          defaultValue: 12,
        },
      ],
    },

    /* -------------------------------------------
     * VAST ADS (VIDEO / TV / LIVE STREAMS)
     * ------------------------------------------- */
    {
      name: 'vastAds',
      label: 'VAST Ad Settings',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Video VAST Ads',
        },

        {
          name: 'provider',
          label: 'Ad Provider',
          type: 'select',
          defaultValue: 'custom',
          options: [
            { label: 'Custom VAST URL', value: 'custom' },
            { label: 'Google Ad Manager', value: 'gam' },
            { label: 'SpringServe', value: 'springserve' },
            { label: 'SpotX (Magnite)', value: 'spotx' },
            { label: 'FreeWheel', value: 'freewheel' },
            { label: 'Other', value: 'other' },
          ],
        },

        {
          name: 'vastTagUrl',
          label: 'Primary VAST Tag URL',
          type: 'textarea',
          admin: {
            description: 'Full VAST tag URL from your ad provider.',
          },
        },

        {
          name: 'backupVastTagUrl',
          label: 'Backup VAST Tag URL',
          type: 'textarea',
          admin: {
            description: 'Used if the primary VAST fails to load.',
          },
        },

        /* Targets */
        {
          name: 'adTargets',
          label: 'Where to Show Ads',
          type: 'group',
          fields: [
            { name: 'web', type: 'checkbox', defaultValue: true, label: 'Web Player' },
            { name: 'mobile', type: 'checkbox', defaultValue: true, label: 'Mobile Apps' },
            {
              name: 'tvApps',
              type: 'checkbox',
              defaultValue: true,
              label: 'TV Apps (Roku/FireTV/Apple TV)',
            },
            {
              name: 'onDemandVideos',
              type: 'checkbox',
              defaultValue: true,
              label: 'On-Demand Video',
            },
            { name: 'musicVideos', type: 'checkbox', defaultValue: false, label: 'Music Videos' },
          ],
        },

        /* Positions */
        {
          name: 'adPositions',
          label: 'Ad Positions',
          type: 'group',
          fields: [
            { name: 'preRoll', type: 'checkbox', defaultValue: true, label: 'Pre-Roll' },
            { name: 'midRoll', type: 'checkbox', defaultValue: false, label: 'Mid-Roll' },
            { name: 'postRoll', type: 'checkbox', defaultValue: false, label: 'Post-Roll' },
            {
              name: 'midRollInterval',
              label: 'Mid-Roll Every X Minutes',
              type: 'number',
              defaultValue: 10,
              admin: {
                description: 'Only used when mid-roll is enabled.',
              },
            },
          ],
        },

        /* Frequency Caps */
        {
          name: 'frequency',
          label: 'Ad Frequency Settings',
          type: 'group',
          fields: [
            {
              name: 'maxAdsPerHour',
              label: 'Max Ads Per Hour',
              type: 'number',
              defaultValue: 6,
            },
            {
              name: 'minTimeBetweenAds',
              label: 'Min Time Between Ads (Minutes)',
              type: 'number',
              defaultValue: 5,
              admin: {
                description: 'Minimum minutes between ads for a single viewer.',
              },
            },
          ],
        },

        /* SSAI */
        {
          name: 'ssai',
          label: 'Server-Side Ad Insertion (SSAI)',
          type: 'group',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: false,
              label: 'Enable SSAI',
            },
            {
              name: 'provider',
              type: 'text',
              label: 'SSAI Provider (e.g., Mux, Cloudflare Stream)',
            },
            {
              name: 'configUrl',
              type: 'text',
              label: 'SSAI Config / Manifest URL',
            },
          ],
        },
      ],
    },
  ],
}
