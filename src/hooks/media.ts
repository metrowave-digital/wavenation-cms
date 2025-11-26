import type { CollectionBeforeChangeHook } from 'payload'
import { promises as fs } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { extractVideoMetadata, extractAudioMetadata } from '@/utils/media/extractMetadata'

export const populateMediaMetadata: CollectionBeforeChangeHook = async ({ data, req }) => {
  const file = req?.file
  if (!file) return data

  const tempPath = join(tmpdir(), `${Date.now()}-${file.name}`)

  try {
    // ---------------------------------------------
    // 1. Write temp file asynchronously
    // ---------------------------------------------
    await fs.writeFile(tempPath, file.data)

    const mime = file.mimetype

    // ---------------------------------------------
    // 2. VIDEO METADATA
    // ---------------------------------------------
    if (mime.startsWith('video/')) {
      try {
        const info = await extractVideoMetadata(tempPath)

        return {
          ...data,
          type: 'video',
          videoMetadata: {
            duration: info.duration,
            width: info.width,
            height: info.height,
            bitrate: info.bitrate,
            frameRate: info.frameRate,
            thumbnail: info.thumbnail,
            dominantColor: info.dominantColor,
            explicit: info.explicit,
            chapters: info.chapters,
            transcript: info.transcript,
          },
        }
      } catch (err) {
        console.error('❌ Video metadata extraction failed:', err)
        // Fail gracefully — upload still succeeds
        return { ...data, type: 'video' }
      }
    }

    // ---------------------------------------------
    // 3. AUDIO METADATA
    // ---------------------------------------------
    if (mime.startsWith('audio/')) {
      try {
        const info = await extractAudioMetadata(tempPath)

        return {
          ...data,
          type: 'audio',
          audioMetadata: {
            duration: info.duration,
            bitrate: info.bitrate,
            sampleRate: info.sampleRate,
            waveform: info.waveform,
            bpm: info.bpm,
            key: info.key,
            explicit: info.explicit,
            loudness: info.loudness,
            emotion: info.emotion,
            transcript: info.transcript,
          },
        }
      } catch (err) {
        console.error('❌ Audio metadata extraction failed:', err)
        return { ...data, type: 'audio' }
      }
    }

    // ---------------------------------------------
    // 4. IMAGE / DOCUMENT fallback
    // ---------------------------------------------
    return {
      ...data,
      type: mime.startsWith('image/') ? 'image' : 'document',
    }
  } finally {
    // ---------------------------------------------
    // 5. Cleanup temp file ALWAYS
    // ---------------------------------------------
    try {
      await fs.unlink(tempPath)
    } catch (cleanupErr) {
      console.warn('⚠️ Could not remove temp file:', tempPath, cleanupErr)
    }
  }
}
