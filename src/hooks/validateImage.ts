import type { CollectionBeforeValidateHook } from 'payload'

export const validateImage: CollectionBeforeValidateHook = ({ data }) => {
  if (data?.mimeType && !data.mimeType.startsWith('image/')) {
    throw new Error('Uploaded file must be an image.')
  }

  return data
}
