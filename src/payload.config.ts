import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'

/* =============================
   ADAPTERS + PLUGINS
============================= */

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

/* =============================
   COLLECTION IMPORTS
============================= */

// Auth / Profiles
import { Users } from './collections/profiles/Users'
import { Profiles } from './collections/profiles/Profiles'
import { Talent } from './collections/profiles/Talent'
import { DJHosts } from './collections/profiles/DJHosts'
import { Guests } from './collections/profiles/Guests'

// Audio / Music
import { Artists } from './collections/audio/Artists'
import { Tracks } from './collections/audio/Tracks'
import { Albums } from './collections/audio/Albums'
import { Playlists } from './collections/audio/Playlists'
import { VoiceMemos } from './collections/audio/VoiceMemos'

// Media (TV / Film / Shows)
import { Media } from './collections/media/Media'
import { Videos } from './collections/media/Videos'
import { Films } from './collections/media/Films'
import { Shows } from './collections/media/Shows'
import { Episodes } from './collections/media/Episodes'
import { Seasons } from './collections/media/Seasons'
import { VOD } from './collections/media/VOD'
import { PlaybackProgress } from './collections/media/PlaybackProgress'

// VOD Structure
import { VODSeasons } from './collections/vod/VODSeasons'
import { VODEpisodes } from './collections/vod/VODEpisodes'
import { VODCategories } from './collections/vod/VODCategories'
import { VODGenres } from './collections/vod/VODGenres'
import { ContinueWatching } from './collections/vod/ContinueWatching'

// Live TV
import { LiveChannels } from './collections/live/LiveChannels'
import { LivePrograms } from './collections/live/LivePrograms'
import { EPGEvents } from './collections/live/EPGEvents'
import { LiveEvents } from './collections/live/LiveEvents'

// Editorial
import { Articles } from './collections/articles/Articles'
import { Categories } from './collections/articles/Categories'
import { Tags } from './collections/articles/Tags'
import { Series } from './collections/articles/Series'
import { Newsroom } from './collections/articles/Newsroom'
import { EditorialStaff } from './collections/articles/EditorialStaff'
import { Drafts } from './collections/articles/Drafts'

// Editorial Extras
import { Announcements } from './collections/editorial/Announcements'
import { JobPostings } from './collections/editorial/JobPostings'
import { Charts } from './collections/editorial/Charts'

// Comments / Reactions
import { Comments } from './collections/comments/Comments'
import { Ratings } from './collections/comments/Ratings'
import { Reactions } from './collections/comments/Reactions'

// Community
import { Posts } from './collections/community/Posts'
import { Messages } from './collections/community/Messages'
import { Notifications } from './collections/community/Notifications'
import { Follows } from './collections/community/Follows'
import { CreatorChannels } from './collections/community/CreatorChannels'
import { Events } from './collections/community/Events'
import { CommunityGroups } from './collections/community/CommunityGroups'
import { EventRegistrations } from './collections/community/EventRegistrations'
import { EventCheckins } from './collections/community/EventCheckins'
import { UserFavorites } from './collections/community/UserFavorites'

// Engagement
import { Contests } from './collections/engagement/Contests'
import { ContestEntries } from './collections/engagement/ContestEntries'
import { Surveys } from './collections/engagement/Surveys'
import { SurveyResponses } from './collections/engagement/SurveyResponses'
import { ChatSessions } from './collections/engagement/ChatSessions'
import { ChatMessages } from './collections/engagement/ChatMessages'
import { Polls } from './collections/engagement/Polls'
import { PollItems } from './collections/engagement/PollItems'
import { PollVotes } from './collections/engagement/PollVotes'

// Podcasts
import { Podcasts } from './collections/podcasts/Podcasts'
import { PodcastEpisodes } from './collections/podcasts/PodcastEpisodes'

// Homepage / Feeds
import { HomepageUnifiedFeed } from './collections/homepage/HomepageUnifiedFeed'
import { HomepageArticlesFeed } from './collections/homepage/HomepageArticlesFeed'
import { HomepageMediaFeed } from './collections/homepage/HomepageMediaFeed'
import { TrendingFeed } from './collections/homepage/TrendingFeed'
import { LatestFeed } from './collections/homepage/LatestFeed'
import { SearchIndex } from './collections/homepage/SearchIndex'
import { AuditTrail } from './collections/homepage/AuditTrail'
import { APIKeys } from './collections/homepage/ApiKeys'

// Ads
import { Advertisers } from './collections/ads/Advertisers'
import { AdSponsors } from './collections/ads/AdSponsors'

// Schedule
import { RadioSchedule } from './collections/schedule/RadioSchedule'
import { TVSchedule } from './collections/schedule/TVSchedule'
import { Channels } from './collections/schedule/Channels'
import { ScheduleOverrides } from './collections/schedule/ScheduleOverrides'

// Ecommerce
import { Products } from './collections/ecommerce/Products'
import { Prices } from './collections/ecommerce/Prices'
import { Orders } from './collections/ecommerce/Orders'
import { Tickets } from './collections/ecommerce/Tickets'
import { DigitalPurchases } from './collections/ecommerce/DigitalPurchases'
import { Entitlements } from './collections/ecommerce/Entitlements'

// Subscriptions
import { SubscriptionPlans } from './collections/subscriptions/SubscriptionPlans'
import { PaidSubscriptions } from './collections/subscriptions/PaidSubscriptions'
import { SubscriptionEvents } from './collections/subscriptions/SubscriptionEvents'

// Monetization
import { CreatorMemberships } from './collections/monetization/CreatorMemberships'
import { ProCreatorEarnings } from './collections/monetization/CreatorEarnings'
import { Tips } from './collections/monetization/Tips'

// Analytics / System
import { Analytics } from './collections/analytics/Analytics'
import WebhookEvents from './collections/analytics/WebhookEvents'
import { EPGCache } from './collections/analytics/EPGCache'
import { SystemLogs } from './collections/analytics/SystemLogs'
import { AnalyticsMetadata } from './collections/algorithms/AnalyticsMetadata'
import { EngagementEvents } from './collections/analytics/EngagementEvents'
import { ContentScores } from './collections/analytics/ContentScores'
import { ActivityLogs } from './collections/analytics/ActivityLogs'

// Globals
import {
  GlobalSettings,
  NavigationMenus,
  AlgorithmSettings,
  HomepageSettings,
  AdsConfig,
  StreamingConfig,
  SearchSettings,
  FeatureToggles,
} from './globals'

/* =============================
   SETUP
============================= */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/* -------------------------------------------------------------
   NO-OP DATABASE ADAPTER FOR BUILD PHASE (Fixes Render errors)
-------------------------------------------------------------- */

const noopDB: any = {
  init: async () => {
    console.warn('[payload] Using noop DB adapter during build.')
  },
  close: async () => {},
  query: async () => ({ rows: [] }),
  supportsTransactions: false,
}

const db =
  process.env.PAYLOAD_SKIP_DB_INIT === 'true'
    ? noopDB
    : postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URI!,
        },
      })

/* =============================
   CONFIG EXPORT
============================= */

export default buildConfig({
  serverURL: process.env.PUBLIC_CMS_URL,
  admin: { user: Users.slug },

  editor: lexicalEditor(),

  db,

  collections: [
    Users,
    Profiles,
    Talent,
    DJHosts,
    Guests,
    Artists,
    Tracks,
    Albums,
    Playlists,
    VoiceMemos,
    Media,
    Videos,
    Films,
    Shows,
    Episodes,
    Seasons,
    VOD,
    PlaybackProgress,
    VODSeasons,
    VODEpisodes,
    VODCategories,
    VODGenres,
    ContinueWatching,
    LiveChannels,
    LivePrograms,
    LiveEvents,
    EPGEvents,
    Articles,
    Categories,
    Tags,
    Series,
    Newsroom,
    EditorialStaff,
    Drafts,
    Announcements,
    JobPostings,
    Charts,
    Comments,
    Ratings,
    Reactions,
    Posts,
    Messages,
    Notifications,
    Follows,
    CreatorChannels,
    Events,
    CommunityGroups,
    EventRegistrations,
    EventCheckins,
    UserFavorites,
    Contests,
    ContestEntries,
    Surveys,
    SurveyResponses,
    ChatSessions,
    ChatMessages,
    Polls,
    PollItems,
    PollVotes,
    Podcasts,
    PodcastEpisodes,
    HomepageUnifiedFeed,
    HomepageArticlesFeed,
    HomepageMediaFeed,
    TrendingFeed,
    LatestFeed,
    SearchIndex,
    AuditTrail,
    APIKeys,
    Advertisers,
    AdSponsors,
    RadioSchedule,
    TVSchedule,
    Channels,
    ScheduleOverrides,
    Products,
    Prices,
    Orders,
    Tickets,
    DigitalPurchases,
    Entitlements,
    SubscriptionPlans,
    PaidSubscriptions,
    SubscriptionEvents,
    CreatorMemberships,
    ProCreatorEarnings,
    Tips,
    Analytics,
    WebhookEvents,
    AnalyticsMetadata,
    EPGCache,
    SystemLogs,
    EngagementEvents,
    ContentScores,
    ActivityLogs,
  ],

  globals: [
    GlobalSettings,
    NavigationMenus,
    AlgorithmSettings,
    HomepageSettings,
    AdsConfig,
    StreamingConfig,
    SearchSettings,
    FeatureToggles,
  ],

  secret: process.env.PAYLOAD_SECRET ?? 'dev-secret',

  plugins: [
    s3Storage({
      bucket: process.env.S3_BUCKET!,
      collections: { media: true },
      config: {
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
      },
    }),
  ],

  typescript: {
    outputFile: path.join(dirname, 'payload-types.ts'),
  },
})
