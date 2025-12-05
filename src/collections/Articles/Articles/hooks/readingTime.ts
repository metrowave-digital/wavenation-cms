import type { CollectionBeforeChangeHook } from 'payload'

export const calculateReadingTime: CollectionBeforeChangeHook = ({ data }) => {
  if (!data) return data

  const textSources: (string | undefined)[] = [
    data.intro,
    data.body,
    data.section1Context,
    data.section2MainStory,
    data.section3CulturalAnalysis,
    data.section4WhatsNext,
    data.message,
    data.application,
    data.sectionStory,
    data.sectionInsight,
    data.sectionVoices,
    data.sectionImpact,
    data.sectionFuture,
  ]

  let combined = ''

  for (const block of textSources) {
    if (typeof block === 'string') {
      combined += ' ' + block
    }
  }

  if (!combined.trim()) {
    data.readingTime = 1
    return data
  }

  const wordCount = combined.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(wordCount / 200))

  data.readingTime = minutes

  return data
}
