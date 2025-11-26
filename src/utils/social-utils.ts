export const normalizeSocialLinks = (socialObject: Record<string, string>) => {
  const cleaned: Record<string, string> = {}

  for (const key in socialObject) {
    const value = socialObject[key]
    if (!value) continue

    const trimmed = value.trim()
    cleaned[key] = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
  }

  return cleaned
}
