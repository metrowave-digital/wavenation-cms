import type { CollectionConfig, GlobalConfig } from 'payload'

// Collections
import { Media } from './Media'
import { MediaTags } from './MediaTags'
import { MediaVariants } from './MediaVariants'
import { MediaAlbums } from './MediaAlbums'
import { Photos } from './Photos'
import { PhotoGallery } from './PhotoGallery'
import { VideoGallery } from './VideoGallery'

// Globals
import { MediaFolders } from './MediaFolders'

// Export array of all media-related collections
export const mediaCollections: CollectionConfig[] = [
  Media,
  MediaTags,
  MediaVariants,
  Photos,
  PhotoGallery,
  VideoGallery,
  MediaAlbums,
]

// Export array of all media-related globals
export const mediaGlobals: GlobalConfig[] = [MediaFolders]

// Re-export for convenience
export * from './Media'
export * from './MediaTags'
export * from './MediaVariants'
export * from './MediaAlbums'
export * from './Photos'
export * from './PhotoGallery'
export * from './VideoGallery'
export * from './MediaFolders'
