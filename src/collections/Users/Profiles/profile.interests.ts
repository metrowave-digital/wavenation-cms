// src/collections/Profiles/profile.interests.ts

import type { Field } from 'payload'

export const profileInterestFields: Field[] = [
  {
    name: 'interestClusters',
    type: 'select',
    hasMany: true,
    options: [
      { label: 'R&B / Soul', value: 'rnb_soul' },
      { label: 'Hip-Hop / Rap', value: 'hiphop' },
      { label: 'Gospel / Inspirational', value: 'gospel' },
      { label: 'House / Dance', value: 'house_dance' },
      { label: 'Southern Soul / Blues', value: 'southern_soul' },
      { label: 'Urban Pop / Crossover', value: 'urban_pop' },
      { label: 'Film & TV', value: 'film_tv' },
      { label: 'Documentaries', value: 'docs' },
      { label: 'Web Series & Digital', value: 'digital_series' },
      { label: 'Podcasts & Talk', value: 'podcasts' },
      { label: 'Culture & Society', value: 'culture' },
      { label: 'Faith & Spirituality', value: 'faith' },
      { label: 'Social Justice & Liberation', value: 'justice' },
      { label: 'Entrepreneurship & Business', value: 'business' },
      { label: 'Fashion & Style', value: 'fashion' },
      { label: 'Technology & Innovation', value: 'tech' },
    ],
  },

  {
    name: 'preferredFormats',
    type: 'select',
    hasMany: true,
    options: [
      { label: 'Radio / Live Audio', value: 'radio' },
      { label: 'On-Demand Music', value: 'music_on_demand' },
      { label: 'TV / Video', value: 'tv_video' },
      { label: 'Film / Features', value: 'film' },
      { label: 'Short-form Video', value: 'short_video' },
      { label: 'Podcasts', value: 'podcasts' },
      { label: 'Articles', value: 'articles' },
    ],
  },

  {
    name: 'discoveryPreferences',
    type: 'select',
    hasMany: true,
    options: [
      { label: 'Emerging Artists', value: 'emerging_artists' },
      { label: 'Local / Regional Scene', value: 'local_scene' },
      { label: 'Indie / Underground', value: 'indie_underground' },
      { label: 'Mainstream Hits', value: 'mainstream' },
      { label: 'Playlist Discovery', value: 'playlist_discovery' },
      { label: 'Curated Shows / Hosts', value: 'host_curated' },
    ],
  },

  {
    name: 'preferredListeningTimes',
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
]
