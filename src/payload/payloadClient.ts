// src/payload/payloadClient.ts

import { getPayload } from 'payload'
import config from '@/payload.config'

let cached = null as any

export async function getPayloadClient() {
  if (cached) return cached

  cached = await getPayload({ config })
  return cached
}
