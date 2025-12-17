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
// IMAGE VARIANTS
// -----------------------------------------------------------
const CROP_VARIANTS = [
  { name: 'thumbnail', width: 400, height: 300 },
  { name: 'square', width: 800, height: 800 },
  { name: 'landscape', width: 1920, height: 1080 },
  { name: 'portrait', width: 1080, height: 1350 },
  { name: 'cinematic', width: 2400, height: 1020 },
]

// -----------------------------------------------------------
// COLLECTION
// -----------------------------------------------------------
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
  // IMAGE PROCESSING (MANUAL CROP + FOCAL POINT)
  // -----------------------------------------------------------
  hooks: {
    beforeChange: [
      async ({ data, originalDoc }) => {
        try {
          const url = originalDoc?.url
          const mime = originalDoc?.mimeType

          if (!url || !mime?.startsWith('image/')) return data

          const response = await fetch(url)
          const buffer = Buffer.from(await response.arrayBuffer())

          data.variants ??= {}

          for (const variant of CROP_VARIANTS) {
            let image = sharp(buffer)

            const manualCrop =
              data.cropOverrides?.[variant.name] ?? originalDoc?.cropOverrides?.[variant.name]

            const metadata = await image.metadata()

            // -----------------------------------
            // MANUAL CROP OVERRIDE
            // -----------------------------------
            if (manualCrop && metadata.width && metadata.height) {
              image = image.extract({
                left: Math.round(manualCrop.x * metadata.width),
                top: Math.round(manualCrop.y * metadata.height),
                width: Math.round(manualCrop.width * metadata.width),
                height: Math.round(manualCrop.height * metadata.height),
              })
            }

            // -----------------------------------
            // FOCAL POINT SMART CROP (SAFE)
            // -----------------------------------
            if (!manualCrop && data.focalPoint && metadata.width && metadata.height) {
              const aspect = variant.width / variant.height

              const cropWidth = Math.min(metadata.width, Math.round(metadata.height * aspect))

              const cropHeight = Math.min(metadata.height, Math.round(metadata.width / aspect))

              const left = Math.round(data.focalPoint.x * metadata.width - cropWidth / 2)

              const top = Math.round(data.focalPoint.y * metadata.height - cropHeight / 2)

              image = image.extract({
                left: Math.max(0, left),
                top: Math.max(0, top),
                width: Math.min(cropWidth, metadata.width),
                height: Math.min(cropHeight, metadata.height),
              })
            }

            // -----------------------------------
            // FINAL RESIZE
            // -----------------------------------
            const processed = await image
              .resize(variant.width, variant.height, {
                fit: 'cover',
                position: 'centre',
              })
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
          console.error('IMAGE PROCESSING ERROR:', err)
          return data
        }
      },
    ],
  },

  // -----------------------------------------------------------
  // FIELDS
  // -----------------------------------------------------------
  fields: [
    // -----------------------------------
    // GENERATED VARIANTS
    // -----------------------------------
    {
      name: 'variants',
      type: 'group',
      admin: { description: 'Generated image variants' },
      fields: CROP_VARIANTS.map((v) => ({
        name: v.name,
        type: 'text',
        admin: { readOnly: true },
      })),
    },

    // -----------------------------------
    // MANUAL CROP OVERRIDES
    // -----------------------------------
    {
      name: 'cropOverrides',
      type: 'group',
      admin: {
        description: 'Manual crop overrides (0–1 normalized values)',
      },
      fields: CROP_VARIANTS.map((v) => ({
        name: v.name,
        type: 'group',
        fields: [
          { name: 'x', type: 'number', min: 0, max: 1 },
          { name: 'y', type: 'number', min: 0, max: 1 },
          { name: 'width', type: 'number', min: 0, max: 1 },
          { name: 'height', type: 'number', min: 0, max: 1 },
        ],
      })),
    },

    // -----------------------------------
    // TABS
    // -----------------------------------
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
          ],
        },

        {
          label: 'Details',
          fields: [
            { name: 'caption', type: 'textarea' },
            { name: 'attribution', type: 'text' },

            // -----------------------------------
            // VISUAL FOCAL POINT PICKER
            // -----------------------------------
            {
              name: 'focalPoint',
              type: 'point',
              admin: {
                description: 'Click the image to set the focal point',
                components: {
                  Field: '@/components/admin/FocalPointPicker',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
