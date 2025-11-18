import path from 'path'
import { fileURLToPath } from 'url'

import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Articles } from './collections/Articles'
import { Categories } from './collections/Categories'
import { Polls } from './collections/Polls'
import { PollItems } from './collections/PollItems'
import { Tags } from './collections/Tags'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PUBLIC_CMS_URL,
  admin: {
    user: Users.slug,
  },

  editor: lexicalEditor(),

  collections: [Users, Media, Articles, Categories, Polls, PollItems, Tags],

  secret: process.env.PAYLOAD_SECRET ?? 'fallback-secret',

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI as string },
  }),

  plugins: [
    s3Storage({
      bucket: process.env.S3_BUCKET!,
      collections: {
        media: true,
      },
      config: {
        region: process.env.S3_REGION, // usually "auto"
        endpoint: process.env.S3_ENDPOINT, // REQUIRED for R2
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true', // REQUIRED for R2
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
      },
    }),
  ],

  typescript: {
    outputFile: path.join(dirname, 'payload-types.ts'),
  },
})
