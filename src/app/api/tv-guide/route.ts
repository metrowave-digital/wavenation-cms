// src/app/api/tv-guide/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const schedule = await payload.find({
    collection: 'tv-schedule',
    limit: 500,
    depth: 2,
    sort: 'startTime',
  })

  const result = schedule.docs.map((item: any) => {
    // Auto-pull program description from relationships
    let description = null

    if (item.programType === 'show' && item.show) description = item.show.description ?? null

    if (item.programType === 'episode' && item.episode)
      description =
        item.episode.description ?? item.episode.summary ?? item.show?.description ?? null

    if (item.programType === 'event' && item.event) description = item.event.description ?? null

    if (item.programType === 'playlist' && item.playlist)
      description = item.playlist.description ?? null

    return {
      id: item.id,
      title: item.title,
      programType: item.programType,
      description,
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
      show: item.show ?? null,
      episode: item.episode ?? null,
      playlist: item.playlist ?? null,
      event: item.event ?? null,
      ageRating: item.ageRating ?? null,
      availability: item.availability ?? null,
    }
  })

  return NextResponse.json(result)
}
