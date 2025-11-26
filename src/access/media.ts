import type { Access } from 'payload'
import { isAdmin, isLoggedIn } from './control'

export const mediaReadAccess: Access = () => true
export const mediaCreateAccess: Access = ({ req }) => isLoggedIn({ req })
export const mediaUpdateAccess: Access = ({ req }) => isAdmin({ req })
export const mediaDeleteAccess: Access = ({ req }) => isAdmin({ req })
