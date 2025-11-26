import type { GlobalConfig } from 'payload'

export const AlgorithmSettings: GlobalConfig = {
  slug: 'algorithm-settings',

  label: 'Algorithm Settings',

  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },

  admin: {
    group: 'System',
    description:
      'Master control for all WaveNation algorithms: recommendation, discovery, playlists, shows, talent, DJ hosts, events, articles, podcasts, and radio.',
  },

  fields: [
    /* -------------------------------------------------------
     * GLOBAL RANKING
     * ------------------------------------------------------- */
    {
      name: 'global',
      type: 'group',
      label: 'Global Ranking Weights',
      fields: [
        { name: 'videoWeight', type: 'number', defaultValue: 0.35 },
        { name: 'audioWeight', type: 'number', defaultValue: 0.25 },
        { name: 'podcastWeight', type: 'number', defaultValue: 0.15 },
        { name: 'eventWeight', type: 'number', defaultValue: 0.15 },
        { name: 'talentWeight', type: 'number', defaultValue: 0.1 },
        { name: 'articleWeight', type: 'number', defaultValue: 0.12 },
        { name: 'showWeight', type: 'number', defaultValue: 0.18 },
        { name: 'djHostWeight', type: 'number', defaultValue: 0.16 },
      ],
    },

    /* -------------------------------------------------------
     * SHOWS (TV, Radio, Digital Series)
     * ------------------------------------------------------- */
    {
      name: 'shows',
      type: 'group',
      label: 'Shows Weighting',
      fields: [
        { name: 'viewership', type: 'number', defaultValue: 0.25 },
        { name: 'liveRatings', type: 'number', defaultValue: 0.2 },
        { name: 'averageWatchTime', type: 'number', defaultValue: 0.2 },
        { name: 'socialEngagement', type: 'number', defaultValue: 0.1 },
        { name: 'clipPerformance', type: 'number', defaultValue: 0.1 },
        { name: 'newEpisodeBoost', type: 'number', defaultValue: 0.1 },
        { name: 'genreMatch', type: 'number', defaultValue: 0.05 },
        { name: 'staffPickBoost', type: 'number', defaultValue: 0.12 },
        { name: 'featuredPriorityMultiplier', type: 'number', defaultValue: 0.03 },
      ],
    },

    /* -------------------------------------------------------
     * DJ HOSTS (Radio Specific)
     * ------------------------------------------------------- */
    {
      name: 'djHosts',
      type: 'group',
      label: 'DJ Hosts Weighting',
      fields: [
        { name: 'mixPerformance', type: 'number', defaultValue: 0.25 },
        { name: 'listenerRetention', type: 'number', defaultValue: 0.2 },
        { name: 'radioEngagement', type: 'number', defaultValue: 0.15 },
        { name: 'socialReach', type: 'number', defaultValue: 0.15 },
        { name: 'onAirFrequency', type: 'number', defaultValue: 0.1 },
        { name: 'genreAuthority', type: 'number', defaultValue: 0.1 },
        { name: 'staffPickBoost', type: 'number', defaultValue: 0.1 },
      ],
    },

    /* -------------------------------------------------------
     * TALENT (On-Air + TV + Podcasts)
     * ------------------------------------------------------- */
    {
      name: 'talent',
      type: 'group',
      label: 'Talent Ranking Weights',
      fields: [
        { name: 'engagement', type: 'number', defaultValue: 0.25 },
        { name: 'showAppearances', type: 'number', defaultValue: 0.15 },
        { name: 'eventAppearances', type: 'number', defaultValue: 0.15 },
        { name: 'socialReach', type: 'number', defaultValue: 0.15 },
        { name: 'recentActivity', type: 'number', defaultValue: 0.15 },
        { name: 'crossPlatformInfluence', type: 'number', defaultValue: 0.1 },
        { name: 'staffPickBoost', type: 'number', defaultValue: 0.1 },
        { name: 'featuredPriorityMultiplier', type: 'number', defaultValue: 0.03 },
      ],
    },

    /* -------------------------------------------------------
     * ARTICLES / NEWS
     * ------------------------------------------------------- */
    {
      name: 'articles',
      type: 'group',
      label: 'Articles & Editorial Weighting',
      fields: [
        { name: 'views', type: 'number', defaultValue: 0.25 },
        { name: 'shares', type: 'number', defaultValue: 0.15 },
        { name: 'likes', type: 'number', defaultValue: 0.1 },
        { name: 'comments', type: 'number', defaultValue: 0.1 },
        { name: 'readingTimeScore', type: 'number', defaultValue: 0.1 },
        { name: 'freshness', type: 'number', defaultValue: 0.2 },
        { name: 'topicMatch', type: 'number', defaultValue: 0.1 },
        { name: 'staffPickBoost', type: 'number', defaultValue: 0.15 },
        { name: 'featuredPriorityMultiplier', type: 'number', defaultValue: 0.02 },
      ],
    },

    /* -------------------------------------------------------
     * VIDEO (Episodes, Films, Clips)
     * ------------------------------------------------------- */
    {
      name: 'video',
      type: 'group',
      label: 'Video Ranking Weights',
      fields: [
        { name: 'views', type: 'number', defaultValue: 0.25 },
        { name: 'completionRate', type: 'number', defaultValue: 0.25 },
        { name: 'likes', type: 'number', defaultValue: 0.15 },
        { name: 'shares', type: 'number', defaultValue: 0.1 },
        { name: 'recentness', type: 'number', defaultValue: 0.1 },
        { name: 'genreMatch', type: 'number', defaultValue: 0.1 },
        { name: 'staffPickBoost', type: 'number', defaultValue: 0.2 },
        { name: 'featuredPriorityMultiplier', type: 'number', defaultValue: 0.03 },
      ],
    },

    /* -------------------------------------------------------
     * AUDIO (Tracks & Music)
     * ------------------------------------------------------- */
    {
      name: 'audio',
      type: 'group',
      label: 'Tracks & Music Weighting',
      fields: [
        { name: 'playCount', type: 'number', defaultValue: 0.2 },
        { name: 'likes', type: 'number', defaultValue: 0.15 },
        { name: 'shares', type: 'number', defaultValue: 0.1 },
        { name: 'recentness', type: 'number', defaultValue: 0.1 },
        { name: 'completionRate', type: 'number', defaultValue: 0.12 },
        { name: 'bpmMatch', type: 'number', defaultValue: 0.08 },
        { name: 'moodMatch', type: 'number', defaultValue: 0.1 },
        { name: 'subgenreMatch', type: 'number', defaultValue: 0.1 },
        { name: 'staffPickBoost', type: 'number', defaultValue: 0.15 },
        { name: 'featuredPriorityMultiplier', type: 'number', defaultValue: 0.02 },
      ],
    },

    /* -------------------------------------------------------
     * PODCASTS (Episodes)
     * ------------------------------------------------------- */
    {
      name: 'podcasts',
      type: 'group',
      label: 'Podcast Episode Weighting',
      fields: [
        { name: 'plays', type: 'number', defaultValue: 0.3 },
        { name: 'completionRate', type: 'number', defaultValue: 0.3 },
        { name: 'subscribers', type: 'number', defaultValue: 0.1 },
        { name: 'shares', type: 'number', defaultValue: 0.1 },
        { name: 'recentness', type: 'number', defaultValue: 0.1 },
        { name: 'topicMatch', type: 'number', defaultValue: 0.1 },
        { name: 'staffPickBoost', type: 'number', defaultValue: 0.15 },
      ],
    },

    /* -------------------------------------------------------
     * RADIO ROTATION
     * ------------------------------------------------------- */
    {
      name: 'radio',
      type: 'group',
      label: 'Radio Rotation Weighting',
      fields: [
        { name: 'rotationTier', type: 'number', defaultValue: 0.4 },
        { name: 'tempoFit', type: 'number', defaultValue: 0.1 },
        { name: 'moodFit', type: 'number', defaultValue: 0.1 },
        { name: 'genreConsistency', type: 'number', defaultValue: 0.1 },
        { name: 'localBoost', type: 'number', defaultValue: 0.1 },
        { name: 'chartBoost', type: 'number', defaultValue: 0.1 },
        { name: 'recency', type: 'number', defaultValue: 0.1 },
      ],
    },

    /* -------------------------------------------------------
     * EVENTS (Concerts, Festivals, Broadcasts)
     * ------------------------------------------------------- */
    {
      name: 'events',
      type: 'group',
      label: 'Event Ranking Weights',
      fields: [
        { name: 'rsvp', type: 'number', defaultValue: 0.2 },
        { name: 'ticketSales', type: 'number', defaultValue: 0.2 },
        { name: 'popularity', type: 'number', defaultValue: 0.15 },
        { name: 'relevance', type: 'number', defaultValue: 0.15 },
        { name: 'recentness', type: 'number', defaultValue: 0.1 },
        { name: 'typePriority', type: 'number', defaultValue: 0.1 },
        { name: 'featuredPriorityMultiplier', type: 'number', defaultValue: 0.02 },
        { name: 'staffPickBoost', type: 'number', defaultValue: 0.1 },
      ],
    },

    /* -------------------------------------------------------
     * SEARCH (Universal)
     * ------------------------------------------------------- */
    {
      name: 'search',
      type: 'group',
      label: 'Search Ranking Weights',
      fields: [
        { name: 'titleMatch', type: 'number', defaultValue: 0.3 },
        { name: 'keywordMatch', type: 'number', defaultValue: 0.2 },
        { name: 'categoryMatch', type: 'number', defaultValue: 0.1 },
        { name: 'popularity', type: 'number', defaultValue: 0.15 },
        { name: 'freshness', type: 'number', defaultValue: 0.1 },
        { name: 'behaviorMatch', type: 'number', defaultValue: 0.1 },
        { name: 'staffPickBoost', type: 'number', defaultValue: 0.05 },
      ],
    },
  ],
}
