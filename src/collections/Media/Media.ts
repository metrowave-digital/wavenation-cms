// src/collections/media/Media.ts
import type { CollectionConfig, Access, AccessArgs, FieldAccess, AccessResult } from 'payload'
import sharp from 'sharp'
import crypto from 'crypto'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import * as AccessControl from '@/access/control'
// -----------------------------------------------------------
// Cloudflare R2 Client (used for variants only)
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
] as const

type VariantName = (typeof CROP_VARIANTS)[number]['name']

// -----------------------------------------------------------
// FIELD ACCESS (BOOLEAN ONLY)
// -----------------------------------------------------------
const staffOnlyField: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false
  return Boolean(AccessControl.isAdmin({ req }) || AccessControl.isStaff({ req }))
}

// -----------------------------------------------------------
// ACCESS HELPERS
// -----------------------------------------------------------

const isLoggedIn: Access = ({ req }) => Boolean(req.user)

/**
 * Read access:
 * - Logged-in users can read all (admin UI + internal ops)
 * - Anonymous MUST pass API key + fetch code AND only sees public + active media
 */
const canReadMedia: Access = ({ req }): AccessResult => {
  // Admin / authenticated override
  if (req?.user) return true

  // Public API lockdown (x-api-key + x-fetch-code)
  const ok = AccessControl.apiLockedRead({ req } as AccessArgs)
  if (!ok) return false

  // Anonymous can only see public, active assets
  return {
    and: [{ visibility: { equals: 'public' } }, { status: { equals: 'active' } }],
  }
}

/**
 * Owner OR Staff/Admin
 */
const isOwnerOrStaffOrAdmin: Access = async ({ req, id }: AccessArgs) => {
  if (!req?.user) return false

  // Admin/staff override
  if (AccessControl.isAdmin({ req })) return true
  if (AccessControl.isStaff({ req })) return true

  if (!id) return false

  const media = await req.payload.findByID({
    collection: 'media',
    id: String(id),
    depth: 0,
  })

  const ownerId =
    typeof (media as any).createdBy === 'string'
      ? (media as any).createdBy
      : (media as any).createdBy?.id

  return ownerId === String(req.user.id)
}

/**
 * Hard delete:
 * enterprise-safe default is to restrict to Admin only.
 * (Soft delete is available via `status: archived/deleted`)
 */
const canHardDelete: Access = ({ req }) => AccessControl.isAdmin({ req })

// -----------------------------------------------------------
// UTIL HELPERS
// -----------------------------------------------------------
const safeString = (v: unknown): string => (typeof v === 'string' ? v : '')

const slugifyBase = (input: string) =>
  input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

const extFromMime = (mime: string): string => {
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/gif') return 'gif'
  if (mime === 'image/svg+xml') return 'svg'
  if (mime === 'video/mp4') return 'mp4'
  if (mime === 'audio/mpeg') return 'mp3'
  if (mime === 'audio/wav') return 'wav'
  return 'bin'
}

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
    defaultColumns: ['filename', 'visibility', 'status', 'mimeType', 'filesize', 'createdBy'],
  },

  access: {
    read: canReadMedia,
    create: isLoggedIn,
    update: isOwnerOrStaffOrAdmin,
    delete: canHardDelete,
  },

  upload: {
    disableLocalStorage: true,
  },

  // -----------------------------------------------------------
  // ENTERPRISE HOOKS
  // - audit fields
  // - checksum + storageKey generation
  // - image variant generation for images only
  // -----------------------------------------------------------
  hooks: {
    beforeValidate: [
      async (args) => {
        const { req, operation, originalDoc } = args
        const data = args.data ?? {}

        // Ensure base defaults
        ;(data as any).visibility ??= (originalDoc as any)?.visibility ?? 'public'
        ;(data as any).status ??= (originalDoc as any)?.status ?? 'active'

        // Audit stamping
        if (req.user) {
          const userId = String(req.user.id)

          if (operation === 'create') {
            ;(data as any).createdBy = userId
          } else if ((originalDoc as any)?.createdBy) {
            // Prevent "createdBy" changes on update
            ;(data as any).createdBy = (originalDoc as any).createdBy
          }

          ;(data as any).updatedBy = userId
        }

        // Derive normalizedFilename + storageKey when possible
        const filename = safeString((data as any).filename || (originalDoc as any)?.filename)
        const mimeType = safeString((data as any).mimeType || (originalDoc as any)?.mimeType)

        if (filename) {
          const base = filename.includes('.')
            ? filename.split('.').slice(0, -1).join('.')
            : filename
          const normalizedBase = slugifyBase(base || 'file')
          ;(data as any).normalizedFilename = normalizedBase
        }

        // Storage key (logical path), helpful for enterprise ops/search and future migrations
        const docId = safeString((originalDoc as any)?.id || (data as any).id)
        const ext = extFromMime(mimeType)
        if (docId && (data as any).normalizedFilename) {
          ;(data as any).storageKey = `media/${docId}/${(data as any).normalizedFilename}.${ext}`
        }

        return data
      },
    ],

    beforeChange: [
      async (args) => {
        const { originalDoc } = args
        const data = args.data ?? {}

        // ---------------------------------------
        // Integrity: sha256 checksum (best-effort)
        // ---------------------------------------
        try {
          const urlCandidate = (originalDoc as any)?.url ?? (data as any).url
          const url = typeof urlCandidate === 'string' ? urlCandidate : ''

          if (url) {
            const res = await fetch(url)
            if (res.ok) {
              const buf = Buffer.from(await res.arrayBuffer())
              ;(data as any).sha256 = crypto.createHash('sha256').update(buf).digest('hex')
            }
          }
        } catch (e) {
          console.warn('MEDIA CHECKSUM WARNING:', e)
        }

        // ---------------------------------------
        // IMAGE VARIANTS (your existing pipeline)
        // ---------------------------------------
        try {
          const urlCandidate = (originalDoc as any)?.url ?? (data as any).url
          const url = typeof urlCandidate === 'string' ? urlCandidate : ''

          const mimeCandidate = (originalDoc as any)?.mimeType ?? (data as any).mimeType
          const mime = typeof mimeCandidate === 'string' ? mimeCandidate : ''

          if (!url || !mime.startsWith('image/')) return data

          const response = await fetch(url)
          if (!response.ok) return data

          const buffer = Buffer.from(await response.arrayBuffer())

          ;(data as any).variants ??= {}

          for (const variant of CROP_VARIANTS) {
            let image = sharp(buffer)

            const manualCrop =
              (data as any).cropOverrides?.[variant.name] ??
              (originalDoc as any)?.cropOverrides?.[variant.name]

            const metadata = await image.metadata()

            if (manualCrop && metadata.width && metadata.height) {
              image = image.extract({
                left: Math.round(manualCrop.x * metadata.width),
                top: Math.round(manualCrop.y * metadata.height),
                width: Math.round(manualCrop.width * metadata.width),
                height: Math.round(manualCrop.height * metadata.height),
              })
            }

            if (!manualCrop && (data as any).focalPoint && metadata.width && metadata.height) {
              const fp = (data as any).focalPoint
              const aspect = variant.width / variant.height
              const cropWidth = Math.min(metadata.width, Math.round(metadata.height * aspect))
              const cropHeight = Math.min(metadata.height, Math.round(metadata.width / aspect))
              const left = Math.round(fp.x * metadata.width - cropWidth / 2)
              const top = Math.round(fp.y * metadata.height - cropHeight / 2)

              image = image.extract({
                left: Math.max(0, left),
                top: Math.max(0, top),
                width: Math.min(cropWidth, metadata.width),
                height: Math.min(cropHeight, metadata.height),
              })
            }

            const processed = await image
              .resize(variant.width, variant.height, {
                fit: 'cover',
                position: 'centre',
              })
              .webp({ quality: 85 })
              .toBuffer()

            const hash = crypto.randomBytes(6).toString('hex')
            const docId = safeString((originalDoc as any)?.id || (data as any).id || 'unknown')
            const key = `media/${docId}/${variant.name}-${hash}.webp`

            await s3.send(
              new PutObjectCommand({
                Bucket: process.env.S3_BUCKET!,
                Key: key,
                Body: processed,
                ContentType: 'image/webp',
              }),
            )
            ;(data as any).variants[variant.name] = `${process.env.S3_PUBLIC_URL}/${key}`
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
  // FIELDS (Enterprise)
  // -----------------------------------------------------------
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Governance',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'visibility',
                  type: 'select',
                  defaultValue: 'public',
                  required: true,
                  options: [
                    { label: 'Public', value: 'public' },
                    { label: 'Unlisted', value: 'unlisted' },
                    { label: 'Private', value: 'private' },
                  ],
                  admin: {
                    description:
                      'Public: visible via public API (with key+code). Unlisted/private require login.',
                  },
                },
                {
                  name: 'status',
                  type: 'select',
                  defaultValue: 'active',
                  required: true,
                  options: [
                    { label: 'Active', value: 'active' },
                    { label: 'Archived', value: 'archived' },
                    { label: 'Deleted (Soft)', value: 'deleted' },
                  ],
                  admin: {
                    description:
                      'Soft delete is enterprise-safe. Hard delete is admin-only and can break references.',
                  },
                },
              ],
            },

            {
              type: 'row',
              fields: [
                {
                  name: 'folderSlug',
                  type: 'text',
                  admin: {
                    description: 'Media folder slug (UI-only, non-relational)',
                  },
                },
                {
                  name: 'tagSlugs',
                  type: 'text',
                  hasMany: true,
                  admin: {
                    description: 'Media tag slugs (UI-only, non-relational)',
                  },
                },
              ],
            },

            {
              name: 'albumSlug',
              type: 'text',
              admin: {
                description: 'Media album slug (UI-only, non-relational)',
              },
            },

            {
              name: 'internalNotes',
              type: 'textarea',
              access: {
                read: staffOnlyField,
                create: staffOnlyField,
                update: staffOnlyField,
              },
              admin: { description: 'Staff-only notes for editorial/ops' },
            },
          ],
        },

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

            {
              name: 'normalizedFilename',
              type: 'text',
              admin: { readOnly: true, description: 'Normalized base filename (search friendly)' },
            },
            {
              name: 'storageKey',
              type: 'text',
              access: {
                read: staffOnlyField,
                create: staffOnlyField,
                update: staffOnlyField,
              },
              admin: {
                readOnly: true,
                description: 'Internal storage key/path (staff only)',
              },
            },
            {
              name: 'sha256',
              type: 'text',
              access: {
                read: staffOnlyField,
                create: staffOnlyField,
                update: staffOnlyField,
              },
              admin: {
                readOnly: true,
                description: 'Integrity checksum (staff only)',
              },
            },
          ],
        },

        {
          label: 'Details',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'caption', type: 'textarea' },
            {
              name: 'alt',
              type: 'text',
              admin: { description: 'Accessibility alt text (images)' },
            },
            { name: 'attribution', type: 'text' },
            {
              name: 'license',
              type: 'select',
              options: [
                { label: 'All Rights Reserved', value: 'all_rights_reserved' },
                { label: 'Creative Commons', value: 'creative_commons' },
                { label: 'Public Domain', value: 'public_domain' },
                { label: 'Licensed', value: 'licensed' },
              ],
            },

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

        {
          label: 'Variants',
          fields: [
            {
              name: 'variants',
              type: 'group',
              admin: { description: 'Generated image variants' },
              fields: CROP_VARIANTS.map((v) => ({
                name: v.name as VariantName,
                type: 'text',
                admin: { readOnly: true },
              })),
            },

            {
              name: 'cropOverrides',
              type: 'group',
              admin: { description: 'Manual crop overrides (0–1 normalized values)' },
              fields: CROP_VARIANTS.map((v) => ({
                name: v.name as VariantName,
                type: 'group',
                fields: [
                  { name: 'x', type: 'number', min: 0, max: 1 },
                  { name: 'y', type: 'number', min: 0, max: 1 },
                  { name: 'width', type: 'number', min: 0, max: 1 },
                  { name: 'height', type: 'number', min: 0, max: 1 },
                ],
              })),
            },
          ],
        },

        {
          label: 'Audit',
          fields: [
            {
              name: 'createdBy',
              type: 'relationship',
              relationTo: 'users',
              admin: { readOnly: true },
            },
            {
              name: 'updatedBy',
              type: 'relationship',
              relationTo: 'users',
              admin: { readOnly: true },
            },
            {
              name: 'source',
              type: 'select',
              defaultValue: 'upload',
              options: [
                { label: 'Upload', value: 'upload' },
                { label: 'Imported', value: 'imported' },
                { label: 'Generated', value: 'generated' },
              ],
              access: {
                read: staffOnlyField,
                create: staffOnlyField,
                update: staffOnlyField,
              },
              admin: { description: 'Staff-only provenance tracking' },
            },
          ],
        },
      ],
    },
  ],
}

export default Media
