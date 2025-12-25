// src/collections/Articles/Articles/types.ts

/* ============================================================
   ENUMS
============================================================ */

export enum ArticleType {
  Standard = 'standard',
  BreakingNews = 'breaking-news',
  MusicReview = 'music-review',
  FilmTVReview = 'film-tv-review',
  Interview = 'interview',
  Feature = 'feature',
  EventRecap = 'event-recap',
  AfricanAmericanCulture = 'african-american-culture',
  Lifestyle = 'lifestyle',
  FaithInspiration = 'faith-inspiration',
  Sponsored = 'sponsored',
  CreatorSpotlight = 'creator-spotlight',
}

export enum ArticleStatus {
  Draft = 'draft',
  Review = 'review',
  NeedsCorrection = 'needs-correction',
  Scheduled = 'scheduled',
  Published = 'published',
}

export enum ArticleBadge {
  Breaking = 'breaking',
  StaffPick = 'staff-pick',
  Radio = 'radio',
  TV = 'tv',
  Sponsored = 'sponsored',
  Exclusive = 'exclusive',
  NewsMenu = 'news-menu-feature',
  DiscoverMenu = 'discover-menu-feature',
}

export enum ArticleCTAType {
  Subscribe = 'subscribe',
  ListenLive = 'listen-live',
  WatchMore = 'watch-more',
  JoinPlus = 'join-plus',
}

/* ============================================================
   BASE ARTICLE
============================================================ */

export interface BaseArticle {
  id: string
  title: string
  slug: string
  type: ArticleType
  status: ArticleStatus

  author?: string
  heroImage?: string
  heroImageAlt?: string

  publishedDate?: string
  scheduledPublishDate?: string

  readingTime?: number

  createdBy?: string
  updatedBy?: string

  createdAt: string
  updatedAt: string
}

/* ============================================================
   ARTICLE VARIANTS
============================================================ */

export interface StandardArticle extends BaseArticle {
  type: ArticleType.Standard
}

export interface BreakingNewsArticle extends BaseArticle {
  type: ArticleType.BreakingNews
  updates?: string[]
}

export interface MusicReviewArticle extends BaseArticle {
  type: ArticleType.MusicReview
  rating?: number
}

export interface FilmTVReviewArticle extends BaseArticle {
  type: ArticleType.FilmTVReview
  rating?: number
}

export interface InterviewArticle extends BaseArticle {
  type: ArticleType.Interview
  interview?: { question: string; answer: string }[]
}

export interface FeatureArticle extends BaseArticle {
  type: ArticleType.Feature
}

export interface EventRecapArticle extends BaseArticle {
  type: ArticleType.EventRecap
}

export interface AfricanAmericanCultureArticle extends BaseArticle {
  type: ArticleType.AfricanAmericanCulture
}

export interface LifestyleArticle extends BaseArticle {
  type: ArticleType.Lifestyle
}

export interface FaithInspirationArticle extends BaseArticle {
  type: ArticleType.FaithInspiration
}

export interface SponsoredArticle extends BaseArticle {
  type: ArticleType.Sponsored
  sponsor?: string
}

export interface CreatorSpotlightArticle extends BaseArticle {
  type: ArticleType.CreatorSpotlight
}

/* ============================================================
   ARTICLE UNION
============================================================ */

export type Article =
  | StandardArticle
  | BreakingNewsArticle
  | MusicReviewArticle
  | FilmTVReviewArticle
  | InterviewArticle
  | FeatureArticle
  | EventRecapArticle
  | AfricanAmericanCultureArticle
  | LifestyleArticle
  | FaithInspirationArticle
  | SponsoredArticle
  | CreatorSpotlightArticle

/* ============================================================
   ARTICLE READ MODEL (SEARCH / FRONTEND SAFE)
============================================================ */

export interface ArticleReadModel {
  id: string
  title: string
  slug: string
  type: ArticleType
  status: ArticleStatus
  publishedDate?: string
  heroImage?: string
  author?: string
  readingTime?: number
}

/* ============================================================
   REVIEWS
============================================================ */

export enum ReviewStatus {
  Approved = 'approved',
  Pending = 'pending',
  Flagged = 'flagged',
  Removed = 'removed',
}

export enum ReviewMediaType {
  Tracks = 'tracks',
  Albums = 'albums',
  Films = 'films',
  Vod = 'vod',
  Podcasts = 'podcasts',
  PodcastEpisodes = 'podcast-episodes',
  Shows = 'shows',
  Episodes = 'episodes',
  Articles = 'articles',
}

export interface BaseReview {
  id: string
  title: string

  rating: number
  criticRating?: number
  spoiler?: boolean

  body?: any

  status: ReviewStatus

  reviewer: string
  mediaType: ReviewMediaType
  mediaItem: string

  createdBy?: string
  updatedBy?: string

  createdAt: string
  updatedAt: string
}

export type Review = BaseReview

export interface ReviewReadModel {
  id: string
  title: string
  rating: number
  reviewer: string
  mediaType: ReviewMediaType
}

/* ============================================================
   ARTIST SPOTLIGHT
============================================================ */

export interface ArtistSpotlight {
  id: string
  title: string
  slug: string

  bannerImage: string
  artist: string
  artistImage?: string

  tagline?: string
  extraInfo?: string

  featuredArticle?: string
  featuredRelease?: string

  createdBy?: string
  updatedBy?: string

  createdAt: string
  updatedAt: string
}

export interface ArtistSpotlightReadModel {
  id: string
  title: string
  slug: string
  artist: string
  bannerImage: string
}

/* ============================================================
   CROSS-COLLECTION CONTENT TYPE (FEEDS / SEARCH)
   Articles • Reviews • Artist Spotlights
============================================================ */

export enum ContentType {
  Article = 'article',
  Review = 'review',
  ArtistSpotlight = 'artist-spotlight',
}

/**
 * Unified content item
 * Used for editorial feeds, admin dashboards, AI ranking, etc.
 */
export type ContentItem =
  | {
      contentType: ContentType.Article
      doc: Article
    }
  | {
      contentType: ContentType.Review
      doc: Review
    }
  | {
      contentType: ContentType.ArtistSpotlight
      doc: ArtistSpotlight
    }

/**
 * Lightweight read model for:
 * - Search results
 * - Home feeds
 * - Category listings
 * - Infinite scroll
 */
export type ContentReadModel =
  | ({ contentType: ContentType.Article } & ArticleReadModel)
  | ({ contentType: ContentType.Review } & ReviewReadModel)
  | ({ contentType: ContentType.ArtistSpotlight } & ArtistSpotlightReadModel)
