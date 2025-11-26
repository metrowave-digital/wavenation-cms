// src/hooks/vod/generateVODPreviewSprites.ts

import { ffmpeg } from '@/lib/ffmpeg-server'
import path from 'node:path'
import fs from 'node:fs/promises'

type SpriteGenerationOptions = {
  columns?: number
  rows?: number
  intervalSeconds?: number
}

/**
 * Generate a sprite sheet and basic JSON metadata for VOD previews.
 */
export async function generateVODPreviewSpritesForFile(
  filePath: string,
  outputDir: string,
  opts: SpriteGenerationOptions = {},
): Promise<{
  spritePath: string
  frames: { x: number; y: number; width: number; height: number; time: number }[]
}> {
  const columns = opts.columns ?? 5
  const rows = opts.rows ?? 5
  const intervalSeconds = opts.intervalSeconds ?? 10

  await fs.mkdir(outputDir, { recursive: true })

  // First, probe metadata for duration & resolution
  const metadata: any = await new Promise((resolve, reject) => {
    ffmpeg(filePath).ffprobe((err: Error | null, data: any) => {
      if (err) return reject(err)
      resolve(data)
    })
  })

  const format = metadata.format ?? {}
  const videoStream = (metadata.streams ?? []).find((s: any) => s.codec_type === 'video')

  const duration = format.duration ? Number(format.duration) : 0
  const width = videoStream?.width ?? 0
  const height = videoStream?.height ?? 0

  const totalFrames = columns * rows
  const spriteFilename = `sprite-${Date.now()}.jpg`
  const spritePath = path.join(outputDir, spriteFilename)

  // We generate N screenshots and let ffmpeg tile them together.
  const tileFilter = `tile=${columns}x${rows}`
  const scaleFilter = width && height ? `scale=${width}:-1` : 'scale=640:-1'

  await new Promise<void>((resolve, reject) => {
    ffmpeg(filePath)
      .on('end', () => resolve())
      .on('error', (err: unknown) => reject(err))
      .videoFilters([scaleFilter, tileFilter])
      .frames(totalFrames)
      .output(spritePath)
      .outputOptions(['-qscale:v 2']) // good quality JPEG
      .run()
  })

  const frameWidth = Math.floor((width || 640) / columns)
  const frameHeight = Math.floor((height || 360) / rows)

  const frames: { x: number; y: number; width: number; height: number; time: number }[] = []

  for (let index = 0; index < totalFrames; index++) {
    const col = index % columns
    const row = Math.floor(index / columns)

    const time = index * intervalSeconds

    if (duration && time > duration) break

    frames.push({
      x: col * frameWidth,
      y: row * frameHeight,
      width: frameWidth,
      height: frameHeight,
      time,
    })
  }

  return { spritePath, frames }
}

/**
 * Hook-style function to attach sprite metadata to a VOD document.
 */
export const generateVODPreviewSprites = async (args: any) => {
  const { doc } = args

  const filePath: string | undefined = doc?.file?.path || doc?.filePath
  if (!filePath) return doc

  try {
    const absoluteInput = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath)

    const outputDir = path.join(process.cwd(), 'tmp', 'vod-sprites')

    const { spritePath, frames } = await generateVODPreviewSpritesForFile(absoluteInput, outputDir)

    return {
      ...doc,
      vodPreviewSprite: {
        spritePath,
        frames,
      },
    }
  } catch (error) {
    console.error('[generateVODPreviewSprites] Failed to generate VOD preview sprites', error)
    return doc
  }
}
