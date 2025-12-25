// src/collections/Profiles/profile.interests.ts

import type { Field, FieldAccess } from 'payload'
import { isAdminRole } from '@/access/control'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Profile owner OR Admin
 * (Explicit preference data)
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
 * System-only fields (implicit signals)
 */
const systemOnlyField: FieldAccess = () => false

/* ============================================================
   ENTERPRISE INTEREST & PERSONALIZATION FIELDS
============================================================ */

export const profileInterestFields: Field[] = [
  /* ==========================================================
     1️⃣ EXPLICIT INTEREST VECTORS (USER-DECLARED)
     (Comparable to Spotify Taste Onboarding)
  ========================================================== */

  {
    name: 'interestClusters',
    type: 'select',
    hasMany: true,
    access: { update: selfOrAdminField },
    admin: {
      description: 'Primary interest domains explicitly selected by the user.',
    },
    options: [
      { label: 'R&B / Soul', value: 'rnb_soul' },
      { label: 'Hip-Hop / Rap', value: 'hiphop' },
      { label: 'Gospel / Inspirational', value: 'gospel' },
      { label: 'House / Dance', value: 'house_dance' },
      { label: 'Southern Soul / Blues', value: 'southern_soul' },
      { label: 'Urban Pop / Crossover', value: 'urban_pop' },
      { label: 'Jazz / Smooth Jazz', value: 'jazz' },
      { label: 'Afrobeats / Global', value: 'afrobeats' },
      { label: 'Film & TV', value: 'film_tv' },
      { label: 'Documentaries', value: 'docs' },
      { label: 'Podcasts & Talk', value: 'podcasts' },
      { label: 'Culture & Society', value: 'culture' },
      { label: 'Faith & Spirituality', value: 'faith' },
      { label: 'Social Justice & Liberation', value: 'justice' },
      { label: 'Entrepreneurship & Business', value: 'business' },
      { label: 'Technology & Innovation', value: 'tech' },
    ],
  },

  {
    name: 'preferredFormats',
    type: 'select',
    hasMany: true,
    access: { update: selfOrAdminField },
    admin: { description: 'Preferred content formats.' },
    options: [
      { label: 'Live Radio', value: 'radio' },
      { label: 'On-Demand Music', value: 'music_on_demand' },
      { label: 'TV / Video', value: 'tv_video' },
      { label: 'Short-form Video', value: 'short_video' },
      { label: 'Podcasts', value: 'podcasts' },
      { label: 'Articles', value: 'articles' },
      { label: 'Playlists', value: 'playlists' },
      { label: 'Live Events', value: 'live_events' },
    ],
  },

  {
    name: 'moodPreferences',
    type: 'select',
    hasMany: true,
    access: { update: selfOrAdminField },
    admin: { description: 'Mood-level content affinity.' },
    options: [
      { label: 'Chill / Relaxed', value: 'chill' },
      { label: 'Energetic / Workout', value: 'energetic' },
      { label: 'Reflective / Spiritual', value: 'reflective' },
      { label: 'Motivational', value: 'motivational' },
      { label: 'Late Night', value: 'late_night' },
    ],
  },

  /* ==========================================================
     2️⃣ TEMPORAL & CONTEXTUAL SIGNALS
     (Used for scheduling + ranking)
  ========================================================== */

  {
    name: 'listeningContext',
    type: 'group',
    access: { update: selfOrAdminField },
    admin: {
      description: 'Contextual listening preferences.',
    },
    fields: [
      {
        name: 'preferredTimes',
        type: 'select',
        hasMany: true,
        options: [
          { label: 'Morning', value: 'morning' },
          { label: 'Midday', value: 'midday' },
          { label: 'Evening', value: 'evening' },
          { label: 'Late Night', value: 'latenight' },
          { label: 'Weekend', value: 'weekend' },
        ],
      },
      {
        name: 'sessionLengthPreference',
        type: 'select',
        defaultValue: 'medium',
        options: [
          { label: 'Short (<15 min)', value: 'short' },
          { label: 'Medium (15–45 min)', value: 'medium' },
          { label: 'Long (45+ min)', value: 'long' },
        ],
      },
    ],
  },

  /* ==========================================================
     3️⃣ NEGATIVE SIGNALS (VERY IMPORTANT)
     (Used by YouTube & Spotify heavily)
  ========================================================== */

  {
    name: 'contentAvoidance',
    type: 'group',
    access: { update: selfOrAdminField },
    admin: {
      description: 'Explicit signals for content the user wants less of.',
    },
    fields: [
      {
        name: 'blockedGenres',
        type: 'select',
        hasMany: true,
        options: [
          { label: 'Explicit Content', value: 'explicit' },
          { label: 'Political', value: 'political' },
          { label: 'Violence', value: 'violence' },
          { label: 'Celebrity Gossip', value: 'gossip' },
        ],
      },
      {
        name: 'blockedFormats',
        type: 'select',
        hasMany: true,
        options: [
          { label: 'Short-form Video', value: 'short_video' },
          { label: 'Long Podcasts', value: 'long_podcasts' },
          { label: 'Live Streams', value: 'live' },
        ],
      },
    ],
  },

  /* ==========================================================
     4️⃣ IMPLICIT BEHAVIORAL VECTORS (SYSTEM-OWNED)
     (ML / Analytics Only)
  ========================================================== */

  {
    name: 'implicitSignals',
    type: 'group',
    access: { update: systemOnlyField },
    admin: {
      description: 'System-derived behavioral signals (non-editable).',
      readOnly: true,
    },
    fields: [
      {
        name: 'topGenresByEngagement',
        type: 'json',
        admin: {
          description: 'Weighted genre scores based on listens, likes, and watch time.',
        },
      },
      {
        name: 'topCreatorsByEngagement',
        type: 'json',
        admin: {
          description: 'Weighted creator affinity based on interactions.',
        },
      },
      {
        name: 'formatAffinityScores',
        type: 'json',
        admin: {
          description: 'Relative preference for audio/video/article formats.',
        },
      },
      {
        name: 'lastInteractionAt',
        type: 'date',
      },
    ],
  },

  /* ==========================================================
     5️⃣ PERSONALIZATION CONTROL FLAGS
     (User trust + compliance)
  ========================================================== */

  {
    name: 'personalizationControls',
    type: 'group',
    access: { update: selfOrAdminField },
    admin: {
      description: 'Controls for how aggressively personalization is applied.',
    },
    fields: [
      {
        name: 'personalizationLevel',
        type: 'select',
        defaultValue: 'balanced',
        options: [
          { label: 'Minimal', value: 'minimal' },
          { label: 'Balanced', value: 'balanced' },
          { label: 'Highly Personalized', value: 'high' },
        ],
      },
      {
        name: 'allowBehaviorTracking',
        type: 'checkbox',
        defaultValue: true,
        admin: {
          description: 'User consent for behavior-based recommendations.',
        },
      },
    ],
  },
]
