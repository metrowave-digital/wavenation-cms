// payload.config.ts — WaveNation CMS Master Config (Auth0 Edition)

import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

/* Payload Core */
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'

/* Cloudflare R2 (via S3 API) */
import { s3Storage } from '@payloadcms/storage-s3'

/* ============================
   ACCESS CONTROL (AUTH0)
============================ */
import * as AccessControl from './access/control'
import * as Roles from './access/roles'

/* ============================
   COLLECTION IMPORTS
============================ */

/* Global Config */
import { GlobalSettings } from './collections/Globals/GlobalSettings'

/* Ads */
import { AdAnalytics } from './collections/Ads/AdAnalytics'
import { AdPlacements } from './collections/Ads/AdPlacements'
import { Ads } from './collections/Ads/Ads'
import { Advertisers } from './collections/Ads/Advertisers'
import { Campaigns } from './collections/Ads/Campaigns'

/* Engagement (NEW) */
import { Alerts } from './collections/Engagement/Alerts'
import { Popups } from './collections/Engagement/Popups'

/* Core User System */
import { Users } from './collections/Users/Users'
import { Profiles } from './collections/Users/Profiles'

/* Global Media */
import { Media } from './collections/Media/Media'

/* Content — Shows / Episodes / TV / Radio */
import { Shows } from './collections/Shows/Shows'
import { Episodes } from './collections/Shows/Episodes'
import { Schedule } from './collections/Shows/Schedule'
import { EPGEntries } from './collections/Shows/EPGEntries'
import ArtistSpotlight from './collections/Articles/ArtistSpotlight'

/* Film + VOD */
import { Films } from './collections/VOD/Films'
import { VOD } from './collections/VOD/VOD'

/* Podcasts */
import { Podcasts } from './collections/Podcasts/Podcasts'
import { PodcastEpisodes } from './collections/Podcasts/PodcastEpisodes'

/* Music */
import { Tracks } from './collections/Music/Tracks'
import { Albums } from './collections/Music/Albums'
import { Playlists } from './collections/Music/Playlists'
import { Charts } from './collections/Music/Charts'

/* Tags / Categories / SEO */
import { Tags } from './collections/Categories/Tags'
import { Categories } from './collections/Categories/Categories'

/* Articles + Reviews */
import { Articles } from './collections/Articles/Articles/'
import { Reviews } from './collections/Articles/Reviews'
import { ReviewReactions } from './collections/Articles/ReviewReactions'

/* Polls */
import { Polls } from './collections/Polls/Polls'
import { PollVotes } from './collections/Polls/PollVotes'

/* Groups */
import { Groups } from './collections/Groups/Groups'
import { GroupPosts } from './collections/Groups/GroupPosts'
import { GroupMessages } from './collections/Groups/GroupMessages'
import { GroupEvents } from './collections/Groups/GroupEvents'

/* Events */
import { Events } from './collections/Events/Events'
import { TicketTypes } from './collections/Events/TicketTypes'
import { Tickets } from './collections/Events/Tickets'
import { TicketTransfer } from './collections/Events/TicketTransfer'
import { EventCheckins } from './collections/Events/EventCheckins'
import { EventPasses } from './collections/Events/EventPasses'
import { EventPromotions } from './collections/Events/EventPromotions'
import { EventBundles } from './collections/Events/EventBundles'
import { EventReports } from './collections/Events/EventReports'
import { EventAnalytics } from './collections/Events/EventAnalytics'
import { Venues } from './collections/Events/Venues'

/* Ecommerce */
import { Products } from './collections/Ecommerce/Products'
import { ProductVariants } from './collections/Ecommerce/ProductVariants'
import { Carts } from './collections/Ecommerce/Carts'
import { EcommerceOrders } from './collections/Ecommerce/EcommerceOrders'
import { ShippingAddresses } from './collections/Ecommerce/ShippingAddresses'
import { PaymentRecords } from './collections/Ecommerce/PaymentRecords'
import { Orders } from './collections/Ecommerce/Orders'

/* Subscriptions */
import { SubscriptionPlans } from './collections/Subscriptions/SubscriptionPlans'
import { Subscriptions } from './collections/Subscriptions/Subscriptions'
import { CreatorTiers } from './collections/Subscriptions/CreatorTiers'
import { CreatorTierBenefits } from './collections/Subscriptions/CreatorTierBenefits'
import { CreatorSubscriptions } from './collections/Subscriptions/CreatorSubscriptions'
import { CreatorEarnings } from './collections/Subscriptions/CreatorEarnings'
import { CreatorPayouts } from './collections/Subscriptions/CreatorPayouts'
import { CreatorRedemptions } from './collections/Subscriptions/CreatorRedemptions'
import { BillingCycles } from './collections/Monetization/BillingCycles'

/* Content Monetization */
import { ContentSubscriptions } from './collections/Monetization/ContentSubscriptions'
import { ContentAccess } from './collections/Monetization/ContentAccess'

/* Messaging */
import { Messages } from './collections/Messaging/Messages'
import { Chats } from './collections/Messaging/Chats'
import { MessageThreads } from './collections/Messaging/MessageThreads'
import { Inbox } from './collections/Messaging/Inbox'
import { Mentions } from './collections/Messaging/Mentions'
import { ChatMedia } from './collections/Messaging/ChatMedia'
import { Announcements } from './collections/Messaging/Announcements'
import { MessageReactions } from './collections/Messaging/MessageReactions'

/* Creator Channels */
import { CreatorChannels } from './collections/Channels/CreatorChannels'
import { ChannelPosts } from './collections/Channels/ChannelPosts'
import { ChannelMedia } from './collections/Channels/ChannelMedia'
import { ChannelAnnouncements } from './collections/Channels/ChannelAnnouncements'
import { ChannelComments } from './collections/Channels/ChannelComments'
import { ChannelReactions } from './collections/Channels/ChannelReactions'
import { ChannelModerators } from './collections/Channels/ChannelModerators'
import { ChannelLivestreams } from './collections/Channels/ChannelLivestreams'
import { ChannelSchedules } from './collections/Channels/ChannelSchedules'
import { ChannelAnalytics } from './collections/Channels/ChannelAnalytics'
import { ChannelPolls } from './collections/Channels/ChannelPolls'
import { ChannelChat } from './collections/Channels/ChannelChat'

/* Engagement Basics */
import { Blocks } from './collections/Engagement/Blocks'
import { Followers } from './collections/Engagement/Followers'
import { Following } from './collections/Engagement/Following'
import { Likes } from './collections/Engagement/Likes'
import { Notifications } from './collections/Engagement/Notifications'
import { NotificationRules } from './collections/Engagement/NotificationRules'
import { Reactions } from './collections/Engagement/Reactions'
import { Comments } from './collections/Engagement/Comments'
import { CommentReactions } from './collections/Engagement/CommentReactions'

/* ============================
   PATH
============================ */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/* ============================
   CONFIG
============================ */

export default buildConfig({
  /* -----------------------------------------------------------
     ADMIN PANEL CONFIG (AUTH0)
  ----------------------------------------------------------- */
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },

  /* -----------------------------------------------------------
     ENABLE CORS (REQUIRED FOR RENDER)
  ----------------------------------------------------------- */
  cors: [
    'http://localhost:3000',
    'http://localhost:3001',

    'https://wavenation.media',
    'https://www.wavenation.media',

    'https://wavenation.online',
    'https://www.wavenation.online',

    'https://portal.wavenation.online',

    'https://wavenation.plus',
    'https://www.wavenation.plus',
  ],

  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',

    'https://wavenation.media',
    'https://www.wavenation.media',

    'https://wavenation.online',
    'https://www.wavenation.online',

    'https://portal.wavenation.online',

    'https://wavenation.plus',
    'https://www.wavenation.plus',
  ],

  /* -----------------------------------------------------------
     COLLECTIONS
  ----------------------------------------------------------- */
  collections: [
    GlobalSettings,
    Alerts,
    Popups,
    Users,
    Profiles,
    Media,

    Shows,
    Episodes,
    Schedule,
    EPGEntries,

    Films,
    VOD,

    Podcasts,
    PodcastEpisodes,

    Tracks,
    Albums,
    Playlists,
    Charts,

    Tags,
    Categories,

    Articles,
    Reviews,
    ReviewReactions,
    ArtistSpotlight,

    Polls,
    PollVotes,

    Groups,
    GroupEvents,
    GroupMessages,
    GroupPosts,

    Events,
    TicketTypes,
    Tickets,
    TicketTransfer,
    EventCheckins,
    EventPasses,
    EventPromotions,
    EventBundles,
    EventReports,
    EventAnalytics,
    Venues,

    Products,
    ProductVariants,
    Carts,
    EcommerceOrders,
    ShippingAddresses,
    PaymentRecords,
    Orders,

    SubscriptionPlans,
    Subscriptions,
    CreatorTiers,
    CreatorTierBenefits,
    CreatorSubscriptions,
    CreatorEarnings,
    CreatorPayouts,
    CreatorRedemptions,
    BillingCycles,

    ContentSubscriptions,
    ContentAccess,

    Messages,
    Chats,
    MessageThreads,
    Inbox,
    Mentions,
    ChatMedia,
    Announcements,
    MessageReactions,

    CreatorChannels,
    ChannelPosts,
    ChannelMedia,
    ChannelAnnouncements,
    ChannelComments,
    ChannelReactions,
    ChannelModerators,
    ChannelLivestreams,
    ChannelSchedules,
    ChannelAnalytics,
    ChannelPolls,
    ChannelChat,

    Blocks,
    Comments,
    CommentReactions,
    Followers,
    Following,
    Likes,
    Notifications,
    NotificationRules,
    Reactions,

    Ads,
    AdPlacements,
    Campaigns,
    Advertisers,
    AdAnalytics,
  ],

  /* -----------------------------------------------------------
     RICH TEXT EDITOR
  ----------------------------------------------------------- */
  editor: lexicalEditor(),

  /* -----------------------------------------------------------
     DATABASE — Neon Postgres
  ----------------------------------------------------------- */
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  /* -----------------------------------------------------------
     STORAGE — Cloudflare R2
  ----------------------------------------------------------- */
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET as string,
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
      },
    }),
  ],

  /* -----------------------------------------------------------
     PAYLOAD CORE
  ----------------------------------------------------------- */
  secret: process.env.PAYLOAD_SECRET!,
  sharp,

  /* -----------------------------------------------------------
     TYPESCRIPT TYPES
  ----------------------------------------------------------- */
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
