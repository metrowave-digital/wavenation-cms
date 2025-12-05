import type { CollectionConfig } from 'payload'
import sharp from 'sharp'
import crypto from 'crypto'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// -----------------------------------------------------------
// Cloudflare R2 Client
// -----------------------------------------------------------
const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
})

// -----------------------------------------------------------
// AUTO-CROP VARIANTS
// -----------------------------------------------------------
const CROP_VARIANTS = [
  { name: 'thumbnail', width: 400, height: 300 },
  { name: 'square', width: 800, height: 800 },
  { name: 'landscape', width: 1920, height: 1080 },
  { name: 'portrait', width: 1080, height: 1350 },
  { name: 'cinematic', width: 2400, height: 1020 },
]

export const Media: CollectionConfig = {
  slug: 'media',

  labels: {
    singular: 'Media',
    plural: 'Media',
  },

  admin: {
    group: 'Core',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'filesize'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => {
      const roles = Array.isArray(req.user?.roles) ? req.user.roles : []
      return roles.includes('admin') || roles.includes('super-admin')
    },
  },

  upload: {
    disableLocalStorage: true,
  },

  // -----------------------------------------------------------
  // THE FIX: BEFORE CHANGE (NOT afterChange)
  // -----------------------------------------------------------
  hooks: {
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        try {
          const url = originalDoc?.url
          const mime = originalDoc?.mimeType

          if (!url || !mime?.startsWith('image/')) return data

          const response = await fetch(url)
          const buffer = Buffer.from(await response.arrayBuffer())

          data.variants ??= {}

          for (const variant of CROP_VARIANTS) {
            const processed = await sharp(buffer)
              .resize(variant.width, variant.height, { fit: 'cover' })
              .webp({ quality: 85 })
              .toBuffer()

            const hash = crypto.randomBytes(6).toString('hex')

            const key = `media/${originalDoc.id}/${variant.name}-${hash}.webp`

            await s3.send(
              new PutObjectCommand({
                Bucket: process.env.S3_BUCKET!,
                Key: key,
                Body: processed,
                ContentType: 'image/webp',
              }),
            )

            data.variants[variant.name] = `${process.env.S3_PUBLIC_URL}/${key}`
          }

          return data
        } catch (err) {
          console.error('AUTO-CROP ERROR:', err)
          return data
        }
      },
    ],
  },

  // -----------------------------------------------------------
  // FIELDS
  // -----------------------------------------------------------
  fields: [
    {
      name: 'variants',
      type: 'group',
      admin: { description: 'Auto-generated image crops' },
      fields: [
        { name: 'thumbnail', type: 'text', admin: { readOnly: true } },
        { name: 'square', type: 'text', admin: { readOnly: true } },
        { name: 'landscape', type: 'text', admin: { readOnly: true } },
        { name: 'portrait', type: 'text', admin: { readOnly: true } },
        { name: 'cinematic', type: 'text', admin: { readOnly: true } },
      ],
    },

    {
      type: 'tabs',
      tabs: [
        {
          label: 'File Info',
          fields: [
            { name: 'filename', type: 'text', admin: { readOnly: true } },
            { name: 'mimeType', type: 'text', admin: { readOnly: true } },
            { name: 'filesize', type: 'number', admin: { readOnly: true } },
            {
              type: 'row',
              fields: [
                { name: 'width', type: 'number', admin: { readOnly: true } },
                { name: 'height', type: 'number', admin: { readOnly: true } },
              ],
            },
            { name: 'duration', type: 'number', admin: { readOnly: true } },
            { name: 'bitrate', type: 'number', admin: { readOnly: true } },
            { name: 'dominantColor', type: 'text', admin: { readOnly: true } },
          ],
        },

        {
          label: 'Details',
          fields: [
            { name: 'caption', type: 'textarea' },
            { name: 'attribution', type: 'text' },
            {
              name: 'focalPoint',
              type: 'point',
              admin: {
                description: 'Primary focus for smart cropping',
              },
            },
          ],
        },

        {
          label: 'Carousel Settings',
          fields: [
            {
              name: 'carouselSettings',
              type: 'group',
              fields: [
                { name: 'enableInArticleCarousel', type: 'checkbox' },
                { name: 'carouselCaption', type: 'textarea' },
                { name: 'carouselAttribution', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
