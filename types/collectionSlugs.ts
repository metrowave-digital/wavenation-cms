import type { CollectionSlug } from 'payload'

export const MEDIA_COLLECTIONS = {
  MEDIA: 'media',
  MEDIA_ALBUMS: 'media-albums',
  MEDIA_VARIANTS: 'media-variants',
  PHOTOS: 'photos',
  PHOTO_GALLERIES: 'photo-galleries',
  VIDEO_GALLERIES: 'video-galleries',
} as const

export type MediaCollectionSlug =
  | typeof MEDIA_COLLECTIONS.MEDIA
  | typeof MEDIA_COLLECTIONS.MEDIA_ALBUMS
  | typeof MEDIA_COLLECTIONS.PHOTOS
  | typeof MEDIA_COLLECTIONS.PHOTO_GALLERIES
  | typeof MEDIA_COLLECTIONS.VIDEO_GALLERIES

export const asCollectionSlug = (slug: MediaCollectionSlug) => slug as unknown as CollectionSlug
