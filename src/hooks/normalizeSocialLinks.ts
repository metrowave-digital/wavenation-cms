// ===============================================
// PLATFORM DEFINITIONS
// ===============================================

const SOCIAL_PLATFORMS: Record<
  string,
  {
    build: (handle: string) => string
    validate?: (url: string) => boolean
  }
> = {
  instagram: { build: (v) => `https://instagram.com/${v}` },
  facebook: { build: (v) => `https://facebook.com/${v}` },
  tiktok: { build: (v) => `https://tiktok.com/@${v}` },
  x: { build: (v) => `https://x.com/${v}` },
  twitter: { build: (v) => `https://x.com/${v}` },
  threads: { build: (v) => `https://www.threads.net/@${v}` },
  snapchat: { build: (v) => `https://snapchat.com/add/${v}` },
  patreon: { build: (v) => `https://patreon.com/${v}` },
  youtube: { build: (v) => `https://youtube.com/${v}` },
  spotify: { build: (v) => `https://open.spotify.com/${v}` },
  applemusic: { build: (v) => `https://music.apple.com/${v}` },
  soundcloud: { build: (v) => `https://soundcloud.com/${v}` },
  bandcamp: { build: (v) => `https://${v}.bandcamp.com` },
  linktree: { build: (v) => `https://linktr.ee/${v}` },
  whatsapp: { build: (v) => `https://wa.me/${v}` },
  telegram: { build: (v) => `https://t.me/${v}` },
  discord: { build: (v) => `https://discord.gg/${v}` },
  twitch: { build: (v) => `https://twitch.tv/${v}` },
  linkedin: { build: (v) => `https://linkedin.com/in/${v}` },
  reddit: { build: (v) => `https://reddit.com/u/${v}` },
  bluesky: { build: (v) => `https://bsky.app/profile/${v}` },
  medium: { build: (v) => `https://medium.com/@${v}` },
  pinterest: { build: (v) => `https://pinterest.com/${v}` },
  vimeo: { build: (v) => `https://vimeo.com/${v}` },
  cashapp: { build: (v) => `https://cash.app/$${v}` },
  paypal: { build: (v) => `https://paypal.me/${v}` },

  // Website: do not modify except normalize
  website: { build: (v) => v },
}

// ===============================================
// URL VALIDATION
// ===============================================

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

const ensureProtocol = (value: string): string => {
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('www.')) {
    return value.startsWith('www.') ? `https://${value}` : value
  }

  return `https://${value}`
}

// ===============================================
// TYPES
// ===============================================

type NormalizeSocialLinksArgs = {
  data: {
    socialLinks?: Record<string, string | undefined>
    [key: string]: any
  }
}

// ===============================================
// MAIN HOOK
// ===============================================

export const normalizeSocialLinks = ({ data }: NormalizeSocialLinksArgs) => {
  if (!data.socialLinks) return data

  for (const rawKey of Object.keys(data.socialLinks)) {
    const key = rawKey.toLowerCase()
    let rawValue = data.socialLinks[rawKey]

    if (!rawValue) continue

    let value = rawValue.trim().replace(/^@/, '')

    const platform = SOCIAL_PLATFORMS[key]

    // -------------------------------------------
    // 1️⃣ If the value is a valid URL → normalize
    // -------------------------------------------
    if (value.startsWith('http')) {
      value = ensureProtocol(value)
      if (!isValidUrl(value)) continue
      data.socialLinks[rawKey] = value.replace(/\/+$/, '')
      continue
    }

    // -------------------------------------------
    // 2️⃣ If known platform → build URL from handle
    // -------------------------------------------
    if (platform) {
      const built = platform.build(value)
      const finalUrl = ensureProtocol(built)
      if (!isValidUrl(finalUrl)) continue
      data.socialLinks[rawKey] = finalUrl.replace(/\/+$/, '')
      continue
    }

    // -------------------------------------------
    // 3️⃣ Otherwise treat as website or domain
    // -------------------------------------------
    const cleanUrl = ensureProtocol(value)
    if (!isValidUrl(cleanUrl)) continue

    data.socialLinks[rawKey] = cleanUrl.replace(/\/+$/, '')
  }

  return data
}
