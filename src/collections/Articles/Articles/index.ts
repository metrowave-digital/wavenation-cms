import type { CollectionConfig, Access, AccessArgs } from 'payload'

import { articleFields } from './fields'
import { articleHooks } from './hooks'
import * as ArticleBlocks from './blocks'
import { isCreator, isStaff } from '@/access/control'

/* -----------------------------------------
   ACCESS CONTROL
------------------------------------------ */
const canUpdateArticle: Access = ({ req, data }: AccessArgs) => {
  const creatorCanEdit = isCreator({ req } as AccessArgs)
  const staffCanEdit = isStaff({ req } as AccessArgs)

  if (data?.status === 'published' || data?.status === 'scheduled') {
    return staffCanEdit
  }

  return creatorCanEdit || staffCanEdit
}

/* -----------------------------------------
   COLLECTION
------------------------------------------ */
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
    /* ================= TITLE + TYPE ================= */
    {
      type: 'row',
      fields: [
        {
          type: 'text',
          name: 'title',
          required: true,
          admin: { width: '70%' },
        },
        {
          type: 'select',
          name: 'type',
          required: true,
          admin: { width: '30%' },
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Breaking News', value: 'breaking-news' },
            { label: 'Music Review', value: 'music-review' },
            { label: 'Film / TV Review', value: 'film-tv-review' },
            { label: 'Interview', value: 'interview' },
            { label: 'Feature', value: 'feature' },
            { label: 'Event Recap', value: 'event-recap' },
            { label: 'African-American / Southern Culture', value: 'african-american-culture' },
            { label: 'Lifestyle', value: 'lifestyle' },
            { label: 'Faith & Inspiration', value: 'faith-inspiration' },
            { label: 'Sponsored Content', value: 'sponsored' },
            { label: 'Creator Spotlight', value: 'creator-spotlight' },
          ],
        },
      ],
    },

    /* ================= STATUS ================= */
    {
      type: 'select',
      name: 'status',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'review' },
        { label: 'Needs Correction', value: 'needs-correction' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },

    /* ================= BADGES ================= */
    {
      type: 'select',
      name: 'badges',
      hasMany: true,
      admin: { position: 'sidebar' },
      options: [
        { label: 'Breaking News', value: 'breaking' },
        { label: 'Staff Pick', value: 'staff-pick' },
        { label: 'Discussed on WaveNation FM', value: 'radio' },
        { label: 'Watch on WaveNation One', value: 'tv' },
        { label: 'Sponsored', value: 'sponsored' },
      ],
    },

    /* ================= SPONSORED DISCLOSURE ================= */
    {
      type: 'textarea',
      name: 'sponsorDisclosure',
      label: 'Sponsor Disclosure',
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.type === 'sponsored',
      },
    },

    /* ================= PUBLISHING ================= */
    { type: 'date', name: 'publishedDate', admin: { position: 'sidebar' } },
    { type: 'date', name: 'scheduledPublishDate', admin: { position: 'sidebar' } },
    { type: 'date', name: 'lastUpdated', admin: { position: 'sidebar', readOnly: true } },

    /* ================= AUTHOR ================= */
    {
      type: 'relationship',
      name: 'author',
      relationTo: 'profiles',
    },

    /* ================= SLUG + HERO ================= */
    { type: 'text', name: 'slug', unique: true, admin: { position: 'sidebar' } },
    { type: 'upload', name: 'heroImage', relationTo: 'media' },
    { type: 'text', name: 'heroImageAlt' },

    /* ================= MEDIA TIE-IN ================= */
    {
      type: 'group',
      name: 'mediaTieIn',
      fields: [
        {
          type: 'select',
          name: 'type',
          options: [
            { label: 'Radio', value: 'radio' },
            { label: 'TV', value: 'tv' },
            { label: 'Playlist', value: 'playlist' },
          ],
        },
        { type: 'text', name: 'label' },
        {
          type: 'relationship',
          name: 'relatedEntity',
          relationTo: ['shows', 'playlists'],
        },
        { type: 'text', name: 'url' },
      ],
    },

    /* ================= RELATED ARTICLES ================= */
    {
      type: 'relationship',
      name: 'relatedArticles',
      relationTo: 'articles',
      hasMany: true,
      maxRows: 2,
    },

    /* ================= CTA ================= */
    {
      type: 'group',
      name: 'cta',
      fields: [
        {
          type: 'select',
          name: 'type',
          options: [
            { label: 'Subscribe', value: 'subscribe' },
            { label: 'Listen Live', value: 'listen-live' },
            { label: 'Watch More', value: 'watch-more' },
            { label: 'Join WaveNation+', value: 'join-plus' },
          ],
        },
        { type: 'text', name: 'headline' },
        { type: 'textarea', name: 'description' },
        { type: 'text', name: 'buttonLabel' },
        { type: 'text', name: 'buttonUrl' },
      ],
    },

    /* ================= CONTENT BLOCKS ================= */
    {
      type: 'blocks',
      name: 'contentBlocks',
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

    /* ================= TEMPLATE FIELDS ================= */
    ...articleFields,
  ],

  hooks: articleHooks,
}

export default Articles
