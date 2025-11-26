// src/lib/ffmpeg-server.ts

import ffmpeg from 'fluent-ffmpeg'

// Read paths from env
const ffmpegPath = process.env.FFMPEG_PATH
const ffprobePath = process.env.FFPROBE_PATH

if (!ffmpegPath) {
  // Don't crash in dev, just warn loudly
  console.warn(
    '[ffmpeg-server] FFMPEG_PATH is not set. ' +
      'Set FFMPEG_PATH in your .env.local to the ffmpeg binary path (e.g. /opt/homebrew/bin/ffmpeg).',
  )
} else {
  ffmpeg.setFfmpegPath(ffmpegPath)
}

if (!ffprobePath) {
  console.warn(
    '[ffmpeg-server] FFPROBE_PATH is not set. ' +
      'Set FFPROBE_PATH in your .env.local to the ffprobe binary path (e.g. /opt/homebrew/bin/ffprobe).',
  )
} else {
  ffmpeg.setFfprobePath(ffprobePath)
}

export { ffmpeg }
