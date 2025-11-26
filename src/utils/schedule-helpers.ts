// ===============================================
// Schedule Helpers (Shared by Radio + TV)
// ===============================================

/**
 * Convert HH:MM time string → minutes from midnight
 */
export const toMinutes = (time: string): number => {
  if (!time) return NaN
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/**
 * Check whether two time ranges overlap.
 * Example:
 *   A: 10:00–12:00
 *   B: 11:00–13:00
 * → Overlaps
 */
export const rangesOverlap = (
  startA: number,
  endA: number,
  startB: number,
  endB: number,
): boolean => {
  return startA < endB && startB < endA
}

/**
 * Shared Type Across Radio + TV Schedules
 */
export type ScheduleDoc = {
  id?: string
  title?: string
  dayOfWeek?: string
  startTime?: string
  endTime?: string
  seasonalBlock?: {
    seasonType?: string
  }
}

/**
 * Validate Conflict Logic for Radio/TV Schedules
 */
export const findScheduleConflicts = async ({
  collection,
  data,
  originalDoc,
  req,
}: {
  collection: 'radio-schedule' | 'tv-schedule'
  data: ScheduleDoc
  originalDoc?: ScheduleDoc | null
  req: any
}) => {
  const { dayOfWeek, startTime, endTime } = data

  if (!dayOfWeek || !startTime || !endTime) return

  const newStart = toMinutes(startTime)
  const newEnd = toMinutes(endTime)

  if (isNaN(newStart) || isNaN(newEnd)) {
    throw new Error(`Invalid time format. Expected HH:MM, received: ${startTime} / ${endTime}`)
  }

  if (newEnd <= newStart) {
    throw new Error(`End time must be AFTER start time.`)
  }

  // Fetch existing entries for same day
  const existing = await req.payload.find({
    collection,
    where: {
      dayOfWeek: { equals: dayOfWeek },
    },
    limit: 250, // large enough for schedules
  })

  if (!existing?.docs?.length) return

  for (const block of existing.docs) {
    // Skip self when updating
    if (originalDoc?.id && block.id === originalDoc.id) continue

    const blockStart = toMinutes(block.startTime)
    const blockEnd = toMinutes(block.endTime)

    if (rangesOverlap(newStart, newEnd, blockStart, blockEnd)) {
      throw new Error(
        `Schedule conflict detected with block "${block.title}" (${block.startTime}–${block.endTime})`,
      )
    }
  }
}
