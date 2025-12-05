// ---------------------------------------------
// Article Types (Enum)
// ---------------------------------------------
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

// ---------------------------------------------
// Base Article Structure (Shared Across All Types)
// ---------------------------------------------
export interface BaseArticle {
  id: string
  title: string
  slug: string
  type: ArticleType

  excerpt?: string
  body?: any // block editor content
  heroImage?: string
  author?: string
  publishedDate?: string

  readingTime?: number
  seo?: any

  createdAt: string
  updatedAt: string
}

// ---------------------------------------------
// Type-Specific Interfaces (You Will Fill These)
// ---------------------------------------------

export interface StandardArticle extends BaseArticle {
  type: ArticleType.Standard
}

export interface BreakingNewsArticle extends BaseArticle {
  type: ArticleType.BreakingNews
  // fields: urgency, newsroomSource, verified, updateTimeline...
}

export interface MusicReviewArticle extends BaseArticle {
  type: ArticleType.MusicReview
  // fields: rating, album, artist, standoutTracks...
}

export interface FilmTVReviewArticle extends BaseArticle {
  type: ArticleType.FilmTVReview
  // fields: rating, director, cast, episode/season...
}

export interface InterviewArticle extends BaseArticle {
  type: ArticleType.Interview
  // fields: interviewee Name, role, social links, transcript blocks...
}

export interface FeatureArticle extends BaseArticle {
  type: ArticleType.Feature
  // fields: longform layout options, sections...
}

export interface EventRecapArticle extends BaseArticle {
  type: ArticleType.EventRecap
  // fields: eventName, location, photoGallery, highlightMoments...
}

export interface AfricanAmericanCultureStoryArticle extends BaseArticle {
  type: ArticleType.AfricanAmericanCulture
  // fields: historical era, cultural theme, people groups...
}

export interface LifestyleArticle extends BaseArticle {
  type: ArticleType.Lifestyle
  // fields: category (food, travel, fashion), tips list, recommendations...
}

export interface FaithInspirationArticle extends BaseArticle {
  type: ArticleType.FaithInspiration
  // fields: scripture, devotional point, prayer, affirmation...
}

export interface SponsoredContentArticle extends BaseArticle {
  type: ArticleType.Sponsored
  // fields: sponsor name, sponsorLogo, sponsorshipDisclosure...
}

export interface CreatorSpotlightArticle extends BaseArticle {
  type: ArticleType.CreatorSpotlight
  // fields: creatorId, social links, featured works, interview Q&A...
}

// ---------------------------------------------
// Union Type for All Articles
// ---------------------------------------------
export type Article =
  | StandardArticle
  | BreakingNewsArticle
  | MusicReviewArticle
  | FilmTVReviewArticle
  | InterviewArticle
  | FeatureArticle
  | EventRecapArticle
  | AfricanAmericanCultureStoryArticle
  | LifestyleArticle
  | FaithInspirationArticle
  | SponsoredContentArticle
  | CreatorSpotlightArticle

export interface StandardArticle extends BaseArticle {
  type: ArticleType.Standard

  subtitle?: string
  category?: string
  subCategory?: string
  tags?: string[]
  publishDate?: string

  seoTitle?: string
  seoDescription?: string

  heroImage?: string // media relationship
  heroImageAlt?: string

  introParagraph?: string

  section1Context?: string
  section2MainStory?: string
  section3CulturalAnalysis?: string
  section4WhatsNext?: string

  creditsSources?: string
  socialCopyShort?: string
  socialCopyLong?: string
  altTextForImages?: string
}

export interface BreakingNewsArticle extends BaseArticle {
  type: ArticleType.BreakingNews

  subtitle?: string
  tags?: string[]

  category?: string
  subCategory?: string

  whatHappened?: string

  confirmedDetails?: string[] // bullet list
  notYetConfirmed?: string

  statements?: string // official statements only
  context?: string // related history or events

  updates?: string[] // live updating blocks

  socialCopyTwitter?: string
  socialCopyInstagram?: string
}
