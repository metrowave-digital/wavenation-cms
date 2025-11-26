// src/utils/schedule.ts
import payload from 'payload'

/* -------------------------------------------------------
 * Helpers
 * ------------------------------------------------------ */
const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

const rangesOverlap = (startA: number, endA: number, startB: number, endB: number): boolean => {
  return startA < endB && startB < endA
}

/* -------------------------------------------------------
 * Main Conflict Checker
 * ------------------------------------------------------ */

export async function findScheduleConflicts({
  collection,
  data,
}: {
  collection: 'radio-schedule' | 'tv-schedule'
  data: any
}) {
  const { dayOfWeek, startTime, endTime } = data

  if (!dayOfWeek || !startTime || !endTime) return []

  const start = toMinutes(startTime)
  const end = toMinutes(endTime)

  // Fetch ALL schedule entries for that day
  const existing = await payload.find({
    collection,
    where: {
      dayOfWeek: { equals: dayOfWeek },
    },
    limit: 500,
  })

  const conflicts = existing.docs.filter((item: any) => {
    if (data.id && item.id === data.id) return false // editing same record

    if (!item.startTime || !item.endTime) return false

    const s = toMinutes(item.startTime)
    const e = toMinutes(item.endTime)

    return rangesOverlap(start, end, s, e)
  })

  return conflicts
}
