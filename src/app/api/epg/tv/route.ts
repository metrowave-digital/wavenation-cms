// src/app/api/epg/tv/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

function parseDay(value: string | null) {
  if (!value) return null
  const valid = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'Sunday']
  const v = value.toLowerCase()
  return valid.includes(v) ? v : null
}

function buildTime(dateStr: string | null, time: string) {
  if (!dateStr || !time) return null
  const [h, m] = time.split(':').map(Number)
  const date = new Date(dateStr + 'T00:00:00Z')
  date.setUTCHours(h, m, 0, 0)
  return date.toISOString()
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const day = parseDay(url.searchParams.get('day'))
  const date = url.searchParams.get('date')

  const where: any = {}
  if (day) where.dayOfWeek = { equals: day }

  const schedule = await payload.find({
    collection: 'tv-schedule',
    where,
    depth: 2,
    sort: 'startTime',
    limit: 500,
  })

  const items = schedule.docs.map((block: any) => {
    let desc = null

    if (block.programType === 'show' && block.show) desc = block.show.description ?? null

    if (block.programType === 'episode' && block.episode)
      desc = block.episode.description ?? block.episode.summary ?? block.show?.description ?? null

    if (block.programType === 'event' && block.event) desc = block.event.description ?? null

    if (block.programType === 'playlist' && block.playlist)
      desc = block.playlist.description ?? null

    return {
      id: block.id,
      title: block.title,
      programType: block.programType,
      description: desc,
      dayOfWeek: block.dayOfWeek,
      startTime: block.startTime,
      endTime: block.endTime,
      startISO: buildTime(date, block.startTime),
      endISO: buildTime(date, block.endTime),
      show: block.show ?? null,
      episode: block.episode ?? null,
      event: block.event ?? null,
      playlist: block.playlist ?? null,
      availability: block.availability ?? null,
    }
  })

  return NextResponse.json({
    channel: {
      id: 'wavenation-tv',
      name: 'WaveNation TV',
      schedule: items,
    },
    meta: {
      day,
      date,
      generatedAt: new Date().toISOString(),
    },
  })
}
