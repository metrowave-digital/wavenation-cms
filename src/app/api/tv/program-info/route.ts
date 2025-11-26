// src/app/api/tv/program-info/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const programs = await payload.find({
    collection: 'tv-schedule',
    sort: 'startTime',
    limit: 500,
    depth: 2, // important so relationship fields include metadata
  })

  const mapped = programs.docs.map((item: any) => {
    let description = null

    // pull metadata based on programType
    if (item.programType === 'show' && item.show) {
      description = item.show.description || null
    }

    if (item.programType === 'episode' && item.episode) {
      description = item.episode.description || item.episode.summary || null
    }

    if (item.programType === 'event' && item.event) {
      description = item.event.description || null
    }

    if (item.programType === 'playlist' && item.playlist) {
      description = item.playlist.description || null
    }

    return {
      id: item.id,
      title: item.title,
      programType: item.programType,
      description, // SAFE
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
      show: item.show?.title ?? null,
      episode: item.episode?.title ?? null,
      playlist: item.playlist?.name ?? null,
      event: item.event?.title ?? null,
      ageRating: item.ageRating?.tvRating ?? null,
    }
  })

  return NextResponse.json(mapped)
}
