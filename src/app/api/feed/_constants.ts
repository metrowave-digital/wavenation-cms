// src/app/api/feed/_constants.ts
export const CONTENT_COLLECTIONS = ['posts', 'videos', 'tracks', 'podcast-episodes', 'vod'] as const

export type ContentCollection = (typeof CONTENT_COLLECTIONS)[number]

export function isContentCollection(x: string): x is ContentCollection {
  return (CONTENT_COLLECTIONS as readonly string[]).includes(x)
}
