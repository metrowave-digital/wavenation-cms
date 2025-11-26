// src/app/api/audio/generate-waveform/route.ts

import { NextResponse } from 'next/server'
import { ffmpeg } from '@/lib/ffmpeg-server'
import { Readable } from 'node:stream'

// Node runtime required
export const runtime = 'nodejs'

type WaveformRequestBody = {
  filePath: string
  /** Number of samples in returned waveform (e.g. 1024, 2048). Defaults to 1024. */
  samples?: number
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as WaveformRequestBody

    if (!body.filePath) {
      return NextResponse.json({ error: 'Missing filePath' }, { status: 400 })
    }

    const samples = body.samples ?? 1024
    const waveform = await generateWaveform(body.filePath, samples)

    return NextResponse.json({ ok: true, samples: waveform })
  } catch (error: any) {
    console.error('[audio/generate-waveform] Error generating waveform', error)
    return NextResponse.json(
      { ok: false, error: error?.message ?? 'Failed to generate waveform' },
      { status: 500 },
    )
  }
}

/**
 * Generate a very simple mono waveform by piping raw PCM data from ffmpeg
 * and downsampling to a fixed-length array of 0–1 amplitudes.
 */
async function generateWaveform(filePath: string, targetSamples: number): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const command = ffmpeg(filePath)
      .format('s16le') // 16-bit PCM
      .audioChannels(1)
      .audioFrequency(44100)
      .noVideo()

    const stream = command.pipe() as Readable

    const chunks: Buffer[] = []

    stream.on('data', (chunk) => {
      chunks.push(chunk)
    })

    stream.on('error', (err) => {
      reject(err)
    })

    stream.on('end', () => {
      try {
        const buffer = Buffer.concat(chunks)

        // Each sample is 2 bytes (16-bit), little-endian signed
        const totalSamples = buffer.length / 2
        if (totalSamples === 0) {
          return resolve(Array(targetSamples).fill(0))
        }

        const step = Math.max(1, Math.floor(totalSamples / targetSamples))
        const waveform: number[] = []

        for (let i = 0; i < totalSamples; i += step) {
          const offset = i * 2
          if (offset + 1 >= buffer.length) break

          const sample = buffer.readInt16LE(offset)
          const normalized = Math.abs(sample) / 32768 // 16-bit max
          waveform.push(normalized)
        }

        // Ensure exactly targetSamples length
        if (waveform.length > targetSamples) {
          waveform.length = targetSamples
        } else if (waveform.length < targetSamples) {
          const last = waveform[waveform.length - 1] ?? 0
          while (waveform.length < targetSamples) {
            waveform.push(last)
          }
        }

        resolve(waveform)
      } catch (err) {
        reject(err)
      }
    })
  })
}
