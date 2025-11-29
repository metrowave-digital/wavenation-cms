import type { CollectionConfig, GlobalConfig } from 'payload'

import { Media } from './Media'
import { MediaTags } from './MediaTags'
import { MediaVariants } from './MediaVariants'
import { MediaFolders } from './MediaFolders'

export const mediaCollections: CollectionConfig[] = [Media, MediaTags, MediaVariants]

export const mediaGlobals: GlobalConfig[] = [MediaFolders]

export * from './Media'
export * from './MediaTags'
export * from './MediaVariants'
export * from './MediaFolders'
