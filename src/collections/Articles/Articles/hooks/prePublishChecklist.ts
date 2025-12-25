import type { CollectionBeforeChangeHook } from 'payload'

export const prePublishChecklist: CollectionBeforeChangeHook = ({ data }) => {
  if (!data) return data

  const checklist = [
    {
      item: 'Title present',
      passed: Boolean(data.title),
    },
    {
      item: 'Slug present',
      passed: Boolean(data.slug),
    },
    {
      item: 'Hero image present',
      passed: Boolean(data.heroImage),
    },
    {
      item: 'Content blocks present',
      passed: Array.isArray(data.contentBlocks) && data.contentBlocks.length > 0,
    },
    {
      item: 'Author assigned',
      passed: Boolean(data.author),
    },
    {
      item: 'Reading time calculated',
      passed: typeof data.readingTime === 'number',
    },
  ]

  data.prePublishChecklist = checklist

  // HARD FAIL only if publishing
  if (data.status === 'published') {
    const failed = checklist.filter((c) => !c.passed)

    if (failed.length > 0) {
      throw new Error(
        `Article cannot be published. Missing: ${failed.map((f) => f.item).join(', ')}`,
      )
    }
  }

  return data
}
