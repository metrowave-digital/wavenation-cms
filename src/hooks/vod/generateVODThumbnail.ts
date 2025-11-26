// src/hooks/vod/generateVODThumbnail.ts

import { ffmpeg } from '@/lib/ffmpeg-server'
import path from 'node:path'
import fs from 'node:fs/promises'

// Simple utility to generate a thumbnail PNG for a video file.
export async function generateThumbnailFile(
  inputPath: string,
  outputDir: string,
  timecode = '00:00:02.000',
): Promise<string> {
  await fs.mkdir(outputDir, { recursive: true })

  const filename = `thumb-${Date.now()}.png`
  const outputPath = path.join(outputDir, filename)

  await new Promise<void>((resolve, reject) => {
    ffmpeg(inputPath)
      .on('end', () => resolve())
      .on('error', (err: unknown) => reject(err))
      .screenshots({
        timestamps: [timecode],
        filename,
        folder: outputDir,
      })
  })

  return outputPath
}

/**
 * Payload hook-style function to attach a thumbnail path/field to a VOD doc.
 * Wire this in your VOD collection as a `afterChange` hook if desired.
 */
export const generateVODThumbnail = async (args: any) => {
  const { doc, req } = args

  // Adjust these according to your actual VOD schema
  const filePath: string | undefined = doc?.file?.path || doc?.filePath

  if (!filePath) {
    return doc
  }

  try {
    const tmpDir = path.join(process.cwd(), 'tmp', 'vod-thumbnails')
    const thumbPath = await generateThumbnailFile(filePath, tmpDir)

    // You can either store a path or upload via Payload here.
    // For now we just attach a temporary path for downstream processing.
    return {
      ...doc,
      vodThumbnailPath: thumbPath,
    }
  } catch (error) {
    console.error('[generateVODThumbnail] Failed to generate thumbnail', error)
    return doc
  }
}
