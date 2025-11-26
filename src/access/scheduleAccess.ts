import type { Access } from 'payload'
import { isAdmin, isHostDJ } from './control'

export const canReadSchedule: Access = () => true

export const canCreateSchedule: Access = ({ req }) => {
  return isAdmin({ req }) || isHostDJ({ req })
}

export const canUpdateSchedule: Access = ({ req }) => {
  return isAdmin({ req }) || isHostDJ({ req })
}

export const canDeleteSchedule: Access = ({ req }) => {
  return isAdmin({ req })
}
