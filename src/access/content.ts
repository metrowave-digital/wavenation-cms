import type { Access } from 'payload'
import { allowMinRole } from './hierarchy'

export const canPublishContent = allowMinRole('editor')
export const canEditContent = allowMinRole('creator')
export const canWriteContent = allowMinRole('contributor')
export const canReadContent: Access = () => true
