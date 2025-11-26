import { NextResponse } from 'next/server'
import payload from 'payload'

const MS_PER_DAY = 24 * 60 * 60 * 1000

function parseWindow(windowParam: string | null): number {
  if (!windowParam) return 7
  const match = windowParam.match(/^(\d+)d$/)
  if (!match) return 7
  const days = parseInt(match[1], 10)
  return Number.isNaN(days) ? 7 : days
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url)
    const windowParam = url.searchParams.get('window')
    const days = parseWindow(windowParam)

    const now = new Date()
    const fromDate = new Date(now.getTime() - days * MS_PER_DAY)

    const events = await payload.find({
      collection: 'analyticsMetadata',
      limit: 10000,
      where: {
        timestamp: {
          greater_than_equal: fromDate.toISOString(),
        },
      },
    })

    type ChannelAgg = {
      plays: number
      views: number
      likes: number
      shares: number
      comments: number
    }

    type CategoryAgg = {
      plays: number
      views: number
      likes: number
      shares: number
      comments: number
    }

    type Summary = {
      plays: number
      views: number
      likes: number
      shares: number
      comments: number
      progress: number[]
      watchTimes: number[]
      devices: Record<string, number>
      locations: Record<string, number>
      hourlyCounts: number[]
      dowCounts: number[]
      channels: Record<string, ChannelAgg>
      categories: Record<string, CategoryAgg>
      origins: Record<string, number>
    }

    const summaryMap = new Map<string, Summary>()

    for (const e of events.docs as any[]) {
      const contentType = e.contentType
      const contentId = e.contentId
      if (!contentType || !contentId) continue

      const key = `${contentType}:${contentId}`

      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          plays: 0,
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0,
          progress: [],
          watchTimes: [],
          devices: {},
          locations: {},
          hourlyCounts: Array(24).fill(0),
          dowCounts: Array(7).fill(0),
          channels: {},
          categories: {},
          origins: {},
        })
      }

      const record = summaryMap.get(key)!
      const ts = e.timestamp ? new Date(e.timestamp) : null
      const hour = ts ? ts.getUTCHours() : null
      const dow = ts ? ts.getUTCDay() : null

      const channel = e.channel as string | undefined
      const category = e.category as string | undefined
      const origin = e.origin as string | undefined

      const ensureChannel = (name: string) => {
        if (!record.channels[name]) {
          record.channels[name] = {
            plays: 0,
            views: 0,
            likes: 0,
            shares: 0,
            comments: 0,
          }
        }
        return record.channels[name]
      }

      const ensureCategory = (name: string) => {
        if (!record.categories[name]) {
          record.categories[name] = {
            plays: 0,
            views: 0,
            likes: 0,
            shares: 0,
            comments: 0,
          }
        }
        return record.categories[name]
      }

      switch (e.eventType) {
        case 'play': {
          record.plays++
          if (channel) ensureChannel(channel).plays++
          if (category) ensureCategory(category).plays++
          break
        }
        case 'view': {
          record.views++
          if (channel) ensureChannel(channel).views++
          if (category) ensureCategory(category).views++
          break
        }
        case 'like': {
          record.likes++
          if (channel) ensureChannel(channel).likes++
          if (category) ensureCategory(category).likes++
          break
        }
        case 'share': {
          record.shares++
          if (channel) ensureChannel(channel).shares++
          if (category) ensureCategory(category).shares++
          break
        }
        case 'comment': {
          record.comments++
          if (channel) ensureChannel(channel).comments++
          if (category) ensureCategory(category).comments++
          break
        }
        case 'watch-progress': {
          if (e.extra?.percentage !== undefined) {
            record.progress.push(Number(e.extra.percentage))
          }
          if (e.extra?.watchTimeSeconds !== undefined) {
            record.watchTimes.push(Number(e.extra.watchTimeSeconds))
          }
          break
        }
      }

      if (hour !== null && hour >= 0 && hour < 24) {
        record.hourlyCounts[hour]++
      }

      if (dow !== null && dow >= 0 && dow < 7) {
        record.dowCounts[dow]++
      }

      if (e.device) {
        record.devices[e.device] = (record.devices[e.device] || 0) + 1
      }

      if (e.location) {
        record.locations[e.location] = (record.locations[e.location] || 0) + 1
      }

      if (origin) {
        record.origins[origin] = (record.origins[origin] || 0) + 1
      }
    }

    const windowDays = Math.max(1, days)

    for (const [key, summary] of summaryMap.entries()) {
      const [contentType, contentId] = key.split(':')

      const completionRate =
        summary.progress.length > 0
          ? summary.progress.reduce((a, b) => a + b, 0) / summary.progress.length
          : 0

      const avgWatchTime =
        summary.watchTimes.length > 0
          ? summary.watchTimes.reduce((a, b) => a + b, 0) / summary.watchTimes.length
          : 0

      const bucketCounts = Array(10).fill(0)
      for (const pct of summary.progress) {
        const safePct = Math.max(0, Math.min(100, pct))
        const idx = Math.min(9, Math.floor(safePct / 10))
        bucketCounts[idx]++
      }

      const retentionBuckets = bucketCounts.map((count, i) => ({
        bucketStart: i * 10,
        bucketEnd: i === 9 ? 100 : (i + 1) * 10,
        count,
      }))

      const engagementScore =
        summary.plays +
        summary.views +
        2 * summary.likes +
        3 * summary.shares +
        2 * summary.comments

      const trendScore = engagementScore / windowDays

      const avgPlaysPerDay = summary.plays / windowDays
      const predictedPlaysNext7Days = Math.round(avgPlaysPerDay * 7 * 1.1)
      const predictedTrendScore = trendScore * 1.1

      const deviceTypes = Object.entries(summary.devices).map(([device, count]) => ({
        device,
        count,
      }))

      const geoData = Object.entries(summary.locations).map(([location, count]) => ({
        location,
        count,
      }))

      const hourlyDistribution = summary.hourlyCounts.map((count, hour) => ({
        hour,
        count,
      }))

      const dowDistribution = summary.dowCounts.map((count, day) => ({
        day,
        count,
      }))

      const channelRollup = Object.entries(summary.channels).map(([channel, ch]) => ({
        channel,
        plays: ch.plays,
        views: ch.views,
        likes: ch.likes,
        engagementScore: ch.plays + ch.views + 2 * ch.likes + 3 * ch.shares + 2 * ch.comments,
      }))

      const categoryRollup = Object.entries(summary.categories).map(([category, cat]) => {
        const catEngagement =
          cat.plays + cat.views + 2 * cat.likes + 3 * cat.shares + 2 * cat.comments
        const catTrend = catEngagement / windowDays
        return {
          category,
          plays: cat.plays,
          views: cat.views,
          likes: cat.likes,
          trendScore: catTrend,
        }
      })

      const originRollup = Object.entries(summary.origins).map(([origin, count]) => ({
        origin,
        count,
      }))

      const data: any = {
        relatedContent: {
          relationTo: contentType,
          value: contentId,
        },
        plays: summary.plays,
        views: summary.views,
        likes: summary.likes,
        shares: summary.shares,
        comments: summary.comments,
        completionRate,
        averageWatchTimeSeconds: avgWatchTime,
        deviceTypes,
        geoData,
        hourlyDistribution,
        dowDistribution,
        retentionBuckets,
        engagementScore,
        trendScore,
        predictedTrendScore,
        predictedPlaysNext7Days,
        channelRollup,
        categoryRollup,
        originRollup,
        windowStart: fromDate.toISOString(),
        windowEnd: now.toISOString(),
      }

      const existing = await payload.find({
        collection: 'analytics',
        where: {
          'relatedContent.relationTo': { equals: contentType },
          'relatedContent.value': { equals: contentId },
        },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'analytics',
          id: existing.docs[0].id,
          data: data as any,
        })
      } else {
        await payload.create({
          collection: 'analytics',
          data: data as any,
        })
      }
    }

    return NextResponse.json({ success: true, processed: summaryMap.size })
  } catch (err) {
    console.error('Advanced analytics aggregation failed:', err)
    return NextResponse.json({ error: 'aggregation-failed' }, { status: 500 })
  }
}
