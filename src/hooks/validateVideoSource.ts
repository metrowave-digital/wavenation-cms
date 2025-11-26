import type { CollectionBeforeValidateHook } from 'payload'

export const validateVideoSource: CollectionBeforeValidateHook = ({ data }) => {
  // Ensure data exists so TS stops complaining
  if (!data) return data

  const type = data.videoType

  if (type === 'cloudflare' && !data.cloudflareId) {
    throw new Error('Cloudflare video ID is required.')
  }

  if (type === 'upload' && !data.videoUpload) {
    throw new Error('Video file upload required.')
  }

  if (type === 'external' && !data.externalUrl) {
    throw new Error('External URL required.')
  }

  return data
}
