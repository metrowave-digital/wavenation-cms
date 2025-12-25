import type { Field } from 'payload'

// Global SEO
import { seoFields } from '@/fields/seo'

// Article Type Field Groups
import { standardArticleFields } from './standard'
import { breakingNewsFields } from './breakingNews'
import { musicReviewFields } from './musicReview'
import { filmTVReviewFields } from './filmTVReview'
import { interviewFields } from './interview'
import { featureArticleFields } from './featureArticle'
import { eventRecapFields } from './eventRecap'
import { africanAmericanCultureStoryFields } from './africanAmericanCultureStory'
import { lifestyleArticleFields } from './lifestyleArticle'
import { faithInspirationFields } from './faithInspiration'
import { sponsoredContentFields } from './sponsoredContent'
import { creatorSpotlightFields } from './creatorSpotlight'

export const articleFields: Field[] = [
  /* ------------------------------------------------------
     GLOBAL SEO — applies to ALL article types
  ------------------------------------------------------ */
  seoFields,

  /* ------------------------------------------------------
     GLOBAL ENGAGEMENT METRICS (READ-ONLY)
  ------------------------------------------------------ */
  {
    type: 'group',
    name: 'engagement',
    label: 'Engagement Metrics',
    admin: {
      position: 'sidebar',
      description: 'Auto-generated analytics fields (read-only)',
    },
    fields: [
      { name: 'views', type: 'number', defaultValue: 0, admin: { readOnly: true } },
      { name: 'likes', type: 'number', defaultValue: 0, admin: { readOnly: true } },
      { name: 'shares', type: 'number', defaultValue: 0, admin: { readOnly: true } },
      { name: 'comments', type: 'number', defaultValue: 0, admin: { readOnly: true } },
      {
        name: 'reactions',
        type: 'array',
        labels: { singular: 'Reaction', plural: 'Reactions' },
        admin: { readOnly: true },
        fields: [
          { name: 'type', type: 'text' },
          { name: 'count', type: 'number', defaultValue: 0 },
        ],
      },
    ],
  },

  /* ------------------------------------------------------
     ARTICLE TYPE GROUPS (CONDITIONAL)
     NOTE: optional chaining is REQUIRED for admin stability
  ------------------------------------------------------ */

  {
    type: 'group',
    name: 'standardFields',
    label: 'Standard Article',
    fields: standardArticleFields,
    admin: { condition: (data) => data?.type === 'standard' },
  },

  {
    type: 'group',
    name: 'breakingNewsFields',
    label: 'Breaking News',
    fields: breakingNewsFields,
    admin: { condition: (data) => data?.type === 'breaking-news' },
  },

  {
    type: 'group',
    name: 'musicReviewFields',
    label: 'Music Review',
    fields: musicReviewFields,
    admin: { condition: (data) => data?.type === 'music-review' },
  },

  {
    type: 'group',
    name: 'filmTVReviewFields',
    label: 'Film / TV Review',
    fields: filmTVReviewFields,
    admin: { condition: (data) => data?.type === 'film-tv-review' },
  },

  {
    type: 'group',
    name: 'interviewFields',
    label: 'Interview',
    fields: interviewFields,
    admin: { condition: (data) => data?.type === 'interview' },
  },

  {
    type: 'group',
    name: 'featureFields',
    label: 'Feature Article',
    fields: featureArticleFields,
    admin: { condition: (data) => data?.type === 'feature' },
  },

  {
    type: 'group',
    name: 'eventRecapFields',
    label: 'Event Recap',
    fields: eventRecapFields,
    admin: { condition: (data) => data?.type === 'event-recap' },
  },

  {
    type: 'group',
    name: 'aaFields',
    label: 'African-American / Southern Culture',
    fields: africanAmericanCultureStoryFields,
    admin: { condition: (data) => data?.type === 'african-american-culture' },
  },

  {
    type: 'group',
    name: 'lifestyleFields',
    label: 'Lifestyle Article',
    fields: lifestyleArticleFields,
    admin: { condition: (data) => data?.type === 'lifestyle' },
  },

  {
    type: 'group',
    name: 'faithFields',
    label: 'Faith & Inspiration',
    fields: faithInspirationFields,
    admin: { condition: (data) => data?.type === 'faith-inspiration' },
  },

  {
    type: 'group',
    name: 'sponsoredFields',
    label: 'Sponsored Content',
    fields: sponsoredContentFields,
    admin: { condition: (data) => data?.type === 'sponsored' },
  },

  {
    type: 'group',
    name: 'csFields',
    label: 'Creator Spotlight',
    fields: creatorSpotlightFields,
    admin: { condition: (data) => data?.type === 'creator-spotlight' },
  },
]
