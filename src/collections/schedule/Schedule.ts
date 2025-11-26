import type { CollectionConfig, CollectionBeforeChangeHook, PayloadRequest } from 'payload'

// =========================
// Helpers
// =========================

const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return NaN
  return h * 60 + m
}

const rangesOverlap = (startA: number, endA: number, startB: number, endB: number): boolean =>
  startA < endB && startB < endA

// =========================
// Local ScheduleDoc helper type
// (we do NOT use this as the hook generic)
// =========================

type ScheduleDoc = {
  id?: string | number
  title?: string
  dayOfWeek?: string
  startTime?: string
  endTime?: string
  seasonalBlock?: {
    seasonType?: string | null
    startDate?: string | null
    endDate?: string | null
  } | null
  conflict?: { hasConflict?: boolean; message?: string }
  isSeasonalOverride?: boolean
  show?: string | { id: string | number } | null
  series?: string | { id: string | number } | null
}

// =========================
// Conflict Finder
// =========================

const findScheduleConflicts = async ({
  collection,
  data,
  originalDoc,
  req,
}: {
  collection: 'radio-schedule' | 'tv-schedule'
  data: ScheduleDoc
  originalDoc?: ScheduleDoc | null
  req: PayloadRequest
}): Promise<{ hasConflict: boolean; messages: string[] }> => {
  const { dayOfWeek, startTime, endTime } = data

  if (!dayOfWeek || !startTime || !endTime) {
    return { hasConflict: false, messages: [] }
  }

  const start = toMinutes(startTime)
  const end = toMinutes(endTime)

  if (isNaN(start) || isNaN(end) || end <= start) {
    return { hasConflict: false, messages: [] }
  }

  const result = await req.payload.find({
    collection,
    limit: 1000,
    where: { dayOfWeek: { equals: dayOfWeek } },
  })

  const conflicts: string[] = []

  result.docs.forEach((rawDoc) => {
    const doc = rawDoc as ScheduleDoc

    if (originalDoc && doc.id === originalDoc.id) return

    const docStart = toMinutes(doc.startTime || '')
    const docEnd = toMinutes(doc.endTime || '')

    if (isNaN(docStart) || isNaN(docEnd) || docEnd <= docStart) return

    if (rangesOverlap(start, end, docStart, docEnd)) {
      conflicts.push(`${doc.title || 'Untitled'} (${doc.startTime}–${doc.endTime})`)
    }
  })

  return {
    hasConflict: conflicts.length > 0,
    messages: conflicts,
  }
}

// =========================
// Shared Hook Builder
// =========================

const buildScheduleHook = (type: 'radio' | 'tv'): CollectionBeforeChangeHook => {
  return async (args) => {
    const { data, originalDoc, req } = args
    const collection: 'radio-schedule' | 'tv-schedule' =
      type === 'radio' ? 'radio-schedule' : 'tv-schedule'

    const schedule = (data || {}) as ScheduleDoc
    const previous = (originalDoc || null) as ScheduleDoc | null

    const { hasConflict, messages } = await findScheduleConflicts({
      collection,
      data: schedule,
      originalDoc: previous,
      req,
    })

    const isSeasonal =
      schedule.seasonalBlock?.seasonType &&
      schedule.seasonalBlock.seasonType !== 'regular' &&
      schedule.seasonalBlock.seasonType !== 'all'

    schedule.isSeasonalOverride = !!isSeasonal

    schedule.conflict = {
      ...(schedule.conflict || {}),
      hasConflict,
      message: hasConflict && messages.length ? `Overlaps with: ${messages.join(', ')}.` : '',
    }

    if (hasConflict) {
      req.payload.logger.warn(
        `[${collection}] Conflict detected for "${schedule.title}" on ${schedule.dayOfWeek} ` +
          `${schedule.startTime}-${schedule.endTime}. Conflicts: ${messages.join(', ')}`,
      )
    }

    // Return mutated data (Payload merges this back in)
    return schedule as any
  }
}

const radioScheduleBeforeChange = buildScheduleHook('radio')
const tvScheduleBeforeChange = buildScheduleHook('tv')

// =========================
// OPTIONAL: Auto-sync back to shows / series
// =========================

const syncRadioShowEpisodes = async (args: any) => {
  const { req, doc } = args
  const schedule = doc as ScheduleDoc

  if (!schedule?.show) return

  const showID =
    typeof schedule.show === 'string' || typeof schedule.show === 'number'
      ? schedule.show
      : schedule.show.id

  if (!showID) return

  await req.payload.update({
    collection: 'shows',
    id: showID,
    data: { updatedAt: new Date().toISOString() },
  })
}

const syncTVSeriesSchedule = async (args: any) => {
  const { req, doc } = args
  const schedule = doc as ScheduleDoc

  if (!schedule?.series) return

  const seriesID =
    typeof schedule.series === 'string' || typeof schedule.series === 'number'
      ? schedule.series
      : schedule.series.id

  if (!seriesID) return

  await req.payload.update({
    collection: 'series',
    id: seriesID,
    data: { updatedAt: new Date().toISOString() },
  })
}

// =========================
// RADIO SCHEDULE COLLECTION
// =========================

export const RadioSchedule: CollectionConfig = {
  slug: 'radio-schedule',
  access: { read: () => true },

  hooks: {
    beforeChange: [radioScheduleBeforeChange],
    afterChange: [syncRadioShowEpisodes],
    afterDelete: [syncRadioShowEpisodes],
  },

  admin: {
    group: 'Programming',
    useAsTitle: 'title',
    defaultColumns: ['title', 'dayOfWeek', 'startTime', 'endTime', 'contentType'],
    components: {
      beforeList: ['/src/payload/components/RadioScheduleTimeline'],
      beforeListTable: ['/src/payload/components/RadioScheduleControls'],
    },
  },

  fields: [
    { name: 'title', type: 'text', required: true },

    {
      name: 'dayOfWeek',
      type: 'select',
      required: true,
      options: [
        { label: 'Monday', value: 'Monday' },
        { label: 'Tuesday', value: 'Tuesday' },
        { label: 'Wednesday', value: 'Wednesday' },
        { label: 'Thursday', value: 'Thursday' },
        { label: 'Friday', value: 'Friday' },
        { label: 'Saturday', value: 'Saturday' },
        { label: 'Sunday', value: 'Sunday' },
      ],
    },

    { name: 'startTime', type: 'text', required: true },
    { name: 'endTime', type: 'text', required: true },

    {
      name: 'contentType',
      type: 'select',
      required: true,
      options: [
        { label: 'Music Block', value: 'music' },
        { label: 'Show', value: 'show' },
        { label: 'Mix / DJ Set', value: 'mix' },
        { label: 'News / Talk', value: 'news' },
        { label: 'Special / Event', value: 'special' },
      ],
    },

    {
      name: 'show',
      type: 'relationship',
      relationTo: 'shows',
      admin: { description: 'Link radio show if applicable.' },
    },

    {
      name: 'seasonalBlock',
      type: 'group',
      fields: [
        {
          name: 'seasonType',
          type: 'select',
          options: [
            { label: 'All Year / Regular', value: 'all' },
            { label: 'Spring', value: 'spring' },
            { label: 'Summer', value: 'summer' },
            { label: 'Fall', value: 'fall' },
            { label: 'Winter', value: 'winter' },
            { label: 'Event / Other', value: 'event' },
          ],
        },
        { name: 'startDate', type: 'date' },
        { name: 'endDate', type: 'date' },
      ],
    },

    {
      name: 'conflict',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        { name: 'hasConflict', type: 'checkbox' },
        { name: 'message', type: 'text' },
      ],
    },

    {
      name: 'isSeasonalOverride',
      type: 'checkbox',
      admin: { readOnly: true },
    },
  ],
}

// =========================
// TV SCHEDULE COLLECTION
// =========================

export const TVSchedule: CollectionConfig = {
  slug: 'tv-schedule',
  access: { read: () => true },

  hooks: {
    beforeChange: [tvScheduleBeforeChange],
    afterChange: [syncTVSeriesSchedule],
    afterDelete: [syncTVSeriesSchedule],
  },

  admin: {
    group: 'Programming',
    useAsTitle: 'title',
    defaultColumns: ['title', 'dayOfWeek', 'startTime', 'endTime', 'blockType'],
    components: {
      beforeList: ['/src/payload/components/TVScheduleTimeline'],
      beforeListTable: ['/src/payload/components/TVScheduleControls'],
    },
  },

  fields: [
    { name: 'title', type: 'text', required: true },

    {
      name: 'dayOfWeek',
      type: 'select',
      required: true,
      options: [
        { label: 'Monday', value: 'Monday' },
        { label: 'Tuesday', value: 'Tuesday' },
        { label: 'Wednesday', value: 'Wednesday' },
        { label: 'Thursday', value: 'Thursday' },
        { label: 'Friday', value: 'Friday' },
        { label: 'Saturday', value: 'Saturday' },
        { label: 'Sunday', value: 'Sunday' },
      ],
    },

    { name: 'startTime', type: 'text', required: true },
    { name: 'endTime', type: 'text', required: true },

    {
      name: 'blockType',
      type: 'select',
      required: true,
      options: [
        { label: 'Show', value: 'show' },
        { label: 'Movie', value: 'movie' },
        { label: 'Rerun / Syndicated', value: 'rerun' },
        { label: 'Special / Event', value: 'special' },
      ],
    },

    {
      name: 'series',
      type: 'relationship',
      relationTo: 'series',
      admin: { description: 'Link scripted TV series if applicable.' },
    },

    {
      name: 'seasonalBlock',
      type: 'group',
      fields: [
        {
          name: 'seasonType',
          type: 'select',
          options: [
            { label: 'All Year / Regular', value: 'all' },
            { label: 'Spring', value: 'spring' },
            { label: 'Summer', value: 'summer' },
            { label: 'Fall', value: 'fall' },
            { label: 'Winter', value: 'winter' },
            { label: 'Event / Other', value: 'event' },
          ],
        },
        { name: 'startDate', type: 'date' },
        { name: 'endDate', type: 'date' },
      ],
    },

    {
      name: 'conflict',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        { name: 'hasConflict', type: 'checkbox' },
        { name: 'message', type: 'text' },
      ],
    },

    {
      name: 'isSeasonalOverride',
      type: 'checkbox',
      admin: { readOnly: true },
    },
  ],
}
