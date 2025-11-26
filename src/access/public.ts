import type { Access } from 'payload'
import { allowMinRole } from './hierarchy'

export const publicReadOnly: Access = () => true
export const staffWrite: Access = allowMinRole('creator')
