// src/utils/media/extractMetadata.ts

import { ffmpeg } from '@/lib/ffmpeg-server'
import path from 'node:path'

export type ExtractedMediaMetadata = {
  format?: {
    filename?: string
    duration?: number
    size?: number
    bit_rate?: number
    format_name?: string
    tags?: Record<string, string>
  }
  video?: {
    codec_name?: string
    width?: number
    height?: number
    bit_rate?: number
    r_frame_rate?: string
  }
  audio?: {
    codec_name?: string
    channels?: number
    sample_rate?: number
    bit_rate?: number
  }
  isVideo: boolean
  isAudio: boolean
}

/**
 * Low-level ffprobe wrapper.
 */
export function ffprobe(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err: unknown, metadata: any) => {
      if (err) return reject(err)
      resolve(metadata)
    })
  })
}

/**
 * Normalize ffprobe output into a simpler structure.
 */
export async function extractMetadata(filePath: string): Promise<ExtractedMediaMetadata> {
  const metadata = await ffprobe(filePath)

  const format = metadata.format ?? {}
  const streams: any[] = metadata.streams ?? []

  const videoStream = streams.find((s) => s.codec_type === 'video')
  const audioStream = streams.find((s) => s.codec_type === 'audio')

  const result: ExtractedMediaMetadata = {
    format: {
      filename: format.filename ?? path.basename(filePath),
      duration: format.duration ? Number(format.duration) : undefined,
      size: format.size ? Number(format.size) : undefined,
      bit_rate: format.bit_rate ? Number(format.bit_rate) : undefined,
      format_name: format.format_name,
      tags: format.tags ?? {},
    },
    video: videoStream
      ? {
          codec_name: videoStream.codec_name,
          width: videoStream.width,
          height: videoStream.height,
          bit_rate: videoStream.bit_rate ? Number(videoStream.bit_rate) : undefined,
          r_frame_rate: videoStream.r_frame_rate,
        }
      : undefined,
    audio: audioStream
      ? {
          codec_name: audioStream.codec_name,
          channels: audioStream.channels,
          sample_rate: audioStream.sample_rate ? Number(audioStream.sample_rate) : undefined,
          bit_rate: audioStream.bit_rate ? Number(audioStream.bit_rate) : undefined,
        }
      : undefined,
    isVideo: !!videoStream,
    isAudio: !!audioStream,
  }

  return result
}

/**
 * Convenience helpers if you want them elsewhere in the codebase.
 */
export async function extractVideoMetadata(filePath: string): Promise<ExtractedMediaMetadata> {
  const meta = await extractMetadata(filePath)
  if (!meta.isVideo) {
    throw new Error(`File at ${filePath} is not recognized as video media.`)
  }
  return meta
}

export async function extractAudioMetadata(filePath: string): Promise<ExtractedMediaMetadata> {
  const meta = await extractMetadata(filePath)
  if (!meta.isAudio) {
    throw new Error(`File at ${filePath} is not recognized as audio media.`)
  }
  return meta
}
