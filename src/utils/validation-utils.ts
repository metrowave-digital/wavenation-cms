export const requireField = (value: any, field: string) => {
  if (!value || value === '') {
    throw new Error(`${field} is required.`)
  }
}

export const validateImageMime = (mime: string) => {
  if (!mime.startsWith('image/')) {
    throw new Error('File must be an image.')
  }
}

export const validateVideoSource = (data: any) => {
  const type = data.videoType

  if (type === 'cloudflare' && !data.cloudflareId) {
    throw new Error('Cloudflare Stream ID is required.')
  }

  if (type === 'upload' && !data.videoUpload) {
    throw new Error('Video file upload is required.')
  }

  if (type === 'external' && !data.externalUrl) {
    throw new Error('External video URL is required.')
  }

  return data
}
