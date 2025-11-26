import { toMinutes, rangesOverlap } from '../utils/schedule-utils'

type FindScheduleConflictArgs = {
  data: {
    id?: string
    title?: string
    dayOfWeek?: string
    startTime?: string
    endTime?: string
    seasonalBlock?: {
      seasonType?: string
    }
    [key: string]: any
  }
  collection: string
  req: {
    payload: {
      find: (args: any) => Promise<{ docs: any[] }>
    }
  }
  originalDoc?: any
}

export const findScheduleConflicts = async ({
  data,
  collection,
  req,
  originalDoc,
}: FindScheduleConflictArgs) => {
  const day = data.dayOfWeek
  const season = data?.seasonalBlock?.seasonType || 'all'

  const start = toMinutes(data.startTime ?? '')
  const end = toMinutes(data.endTime ?? '')

  const existing = await req.payload.find({
    collection,
    where: {
      and: [
        { dayOfWeek: { equals: day } },
        { id: { not_equals: data.id ?? originalDoc?.id ?? '' } },
        {
          'seasonalBlock.seasonType': {
            in: ['all', season],
          },
        },
      ],
    },
    limit: 500,
  })

  for (const block of existing.docs) {
    const s = toMinutes(block.startTime ?? '')
    const e = toMinutes(block.endTime ?? '')

    if (rangesOverlap(start, end, s, e)) {
      throw new Error(`Schedule conflict: "${block.title}" overlaps with this block.`)
    }
  }

  return data
}
