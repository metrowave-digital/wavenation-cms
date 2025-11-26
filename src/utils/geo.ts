// src/utils/geo.ts

import { Reader } from '@maxmind/geoip2-node'
import path from 'path'

let geoReader: Reader | null = null

async function loadGeoDB(): Promise<Reader> {
  if (!geoReader) {
    geoReader = await Reader.open(path.join(process.cwd(), 'geo', 'GeoLite2-City.mmdb'))
  }
  return geoReader
}

export async function lookupGeo(ip: string) {
  try {
    const reader = await loadGeoDB()

    // Cast the reader to any — older versions do not expose .city in the type defs
    const response = (reader as any).city(ip)

    return {
      city: response?.city?.names?.en,
      region: response?.subdivisions?.[0]?.names?.en,
      country: response?.country?.names?.en,
    }
  } catch (err) {
    console.error('GeoIP lookup failed:', err)
    return null
  }
}
