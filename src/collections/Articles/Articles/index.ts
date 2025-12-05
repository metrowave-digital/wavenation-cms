import type { CollectionConfig, Access, AccessArgs } from 'payload'

import { articleFields } from './fields'
import { articleHooks } from './hooks'
import * as ArticleBlocks from './blocks'
import { isCreator, isStaff } from '@/access/control'

const canUpdateArticle: Access = ({ req, data }: AccessArgs) => {
  const creatorCanEdit = isCreator({ req } as AccessArgs)
  const staffCanEdit = isStaff({ req } as AccessArgs)

  const isPublisher = staffCanEdit

  // Only staff/editor-level can move to published or scheduled
  if (data?.status === 'published' || data?.status === 'scheduled') {
    return isPublisher
  }

  // For other statuses (draft, review, needs-correction) creators can edit
  return creatorCanEdit || staffCanEdit
}

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Article',
    plural: 'Articles',
  },

  versions: true,

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'status', 'publishedDate'],
    group: 'Content',
  },

  access: {
    read: () => true,
    create: isCreator as Access,
    update: canUpdateArticle,
    delete: isStaff as Access,
  },

  fields: [
    // ------------------------------
    // TITLE + TYPE
    // ------------------------------
    {
      type: 'row',
      fields: [
        {
          type: 'text',
          name: 'title',
          label: 'Title',
          required: true,
          admin: { width: '70%' },
        },
        {
          type: 'select',
          name: 'type',
          label: 'Article Type',
          required: true,
          admin: { width: '30%' },
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Breaking News', value: 'breaking-news' },
            { label: 'Music Review', value: 'music-review' },
            { label: 'Film/TV Review', value: 'film-tv-review' },
            { label: 'Interview', value: 'interview' },
            { label: 'Feature', value: 'feature' },
            { label: 'Event Recap', value: 'event-recap' },
            {
              label: 'African-American/Southern Culture Story',
              value: 'african-american-culture',
            },
            { label: 'Lifestyle', value: 'lifestyle' },
            { label: 'Faith & Inspiration', value: 'faith-inspiration' },
            { label: 'Sponsored Content', value: 'sponsored' },
            { label: 'Creator Spotlight', value: 'creator-spotlight' },
          ],
        },
      ],
    },

    // ------------------------------
    // EDITORIAL WORKFLOW STATUS
    // ------------------------------
    {
      type: 'select',
      name: 'status',
      label: 'Editorial Status',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'review' },
        { label: 'Needs Correction', value: 'needs-correction' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },

    // ------------------------------
    // PUBLISH DATES
    // ------------------------------
    {
      type: 'date',
      name: 'publishedDate',
      label: 'Publish Date',
      admin: { position: 'sidebar' },
    },
    {
      type: 'date',
      name: 'scheduledPublishDate',
      label: 'Scheduled Publish Date',
      admin: {
        position: 'sidebar',
        description: 'Set a future date/time to auto-publish.',
      },
    },

    // ------------------------------
    // LAST UPDATED
    // ------------------------------
    {
      type: 'date',
      name: 'lastUpdated',
      label: 'Last Updated',
      admin: { position: 'sidebar', readOnly: true },
    },

    // ------------------------------
    // REVIEWER ASSIGNMENT
    // ------------------------------
    {
      type: 'relationship',
      name: 'peerReviewer',
      label: 'Peer Reviewer',
      relationTo: 'profiles',
      admin: {
        position: 'sidebar',
        description: 'Assign an editor to review this article.',
      },
    },

    // ------------------------------
    // QUALITY SCORECARD
    // ------------------------------
    {
      type: 'group',
      name: 'qualityScorecard',
      label: 'Content Quality Scorecard',
      admin: { position: 'sidebar' },
      fields: [
        { type: 'number', name: 'clarityScore', label: 'Clarity (1–10)' },
        { type: 'number', name: 'grammarScore', label: 'Grammar (1–10)' },
        { type: 'number', name: 'culturalScore', label: 'Cultural Fit (1–10)' },
        {
          type: 'number',
          name: 'verifiedSources',
          label: 'Verified Sources Count',
        },
        {
          type: 'number',
          name: 'overallQuality',
          label: 'Overall Score',
          admin: { description: 'Auto or manually determined.' },
        },
      ],
    },

    // ------------------------------
    // AUTHOR
    // ------------------------------
    {
      type: 'relationship',
      name: 'author',
      label: 'Author',
      relationTo: 'profiles',
    },

    // ------------------------------
    // SLUG + HERO IMAGE
    // ------------------------------
    {
      type: 'text',
      name: 'slug',
      label: 'Slug',
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      type: 'upload',
      name: 'heroImage',
      label: 'Hero Image',
      relationTo: 'media',
    },
    {
      type: 'text',
      name: 'heroImageAlt',
      label: 'Hero Image Alt Text',
    },

    // ---------------------------------------------------------
    // 🔥 ARTICLE CAROUSEL BLOCK
    // ---------------------------------------------------------
    {
      type: 'array',
      name: 'carousel',
      label: 'Article Carousel',
      admin: {
        description: 'Add multiple images/videos to display as a scrollable gallery.',
      },
      fields: [
        {
          type: 'upload',
          name: 'media',
          relationTo: 'media',
          required: true,
          label: 'Media Item',
        },
        {
          type: 'textarea',
          name: 'caption',
          label: 'Caption (Optional)',
        },
        {
          type: 'text',
          name: 'attribution',
          label: 'Attribution (Optional)',
        },
      ],
    },

    // ------------------------------
    // READING TIME
    // ------------------------------
    {
      type: 'number',
      name: 'readingTime',
      label: 'Reading Time (minutes)',
      admin: { position: 'sidebar', readOnly: true },
    },

    // ------------------------------
    // EDITORIAL NOTES
    // ------------------------------
    {
      type: 'textarea',
      name: 'editorialNotes',
      label: 'Editorial Notes',
      admin: {
        position: 'sidebar',
        description: 'Required when editing published content or marking Needs Correction.',
      },
    },

    // ------------------------------
    // UNIVERSAL CONTENT BLOCKS
    // ------------------------------
    {
      type: 'blocks',
      name: 'contentBlocks',
      label: 'Article Content Blocks',
      admin: {
        description:
          'Build the article using rich text, media, embeds, quotes, callouts, and more.',
      },
      blocks: [
        ArticleBlocks.RichTextBlock,
        ArticleBlocks.ImageBlock,
        ArticleBlocks.VideoBlock,
        ArticleBlocks.CarouselBlock,
        ArticleBlocks.PullQuoteBlock,
        ArticleBlocks.CalloutBlock,
        ArticleBlocks.EmbedBlock,
        ArticleBlocks.SideBySideBlock,
        ArticleBlocks.DropcapParagraphBlock,
        ArticleBlocks.TimelineBlock,
        ArticleBlocks.QuoteWithImageBlock,
        ArticleBlocks.AuthorBioBlock,
        ArticleBlocks.AdsBlock,
        ArticleBlocks.FootnotesBlock,
        ArticleBlocks.InteractivePollBlock,
      ],
    },

    // ------------------------------
    // TEMPLATE-SPECIFIC FIELDS
    // ------------------------------
    ...articleFields,
  ],

  hooks: articleHooks,
}

export default Articles
