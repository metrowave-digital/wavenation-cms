// src/hooks/vod/extractVODMetadata.ts

import path from 'node:path'
import { ffmpeg } from '@/lib/ffmpeg-server'

export type VODMetadata = {
  duration?: number
  width?: number
  height?: number
  videoCodec?: string
  audioCodec?: string
  frameRate?: string
}

/**
 * Low-level helper to probe a VOD file on disk.
 */
export function probeVODFile(filePath: string): Promise<VODMetadata> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err: Error | null, metadata: any) => {
      if (err) return reject(err)

      const format = metadata.format ?? {}
      const streams: any[] = metadata.streams ?? []

      const videoStream = streams.find((s) => s.codec_type === 'video')
      const audioStream = streams.find((s) => s.codec_type === 'audio')

      const result: VODMetadata = {
        duration: format.duration ? Number(format.duration) : undefined,
        width: videoStream?.width,
        height: videoStream?.height,
        videoCodec: videoStream?.codec_name,
        audioCodec: audioStream?.codec_name,
        frameRate: videoStream?.r_frame_rate,
      }

      resolve(result)
    })
  })
}

/**
 * Hook-style function to attach metadata to a VOD document.
 */
export const extractVODMetadata = async (args: any) => {
  const { doc } = args

  // Adjust according to your actual schema
  const filePath: string | undefined = doc?.file?.path || doc?.filePath

  if (!filePath) {
    return doc
  }

  try {
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath)

    const meta = await probeVODFile(absolutePath)

    return {
      ...doc,
      vodMetadata: meta,
    }
  } catch (error) {
    console.error('[extractVODMetadata] Failed to extract VOD metadata', error)
    return doc
  }
}
