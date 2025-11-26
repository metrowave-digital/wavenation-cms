// src/hooks/vod/r2Client.ts
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
})

export async function getR2ObjectBuffer(key: string): Promise<Buffer> {
  const bucket = process.env.R2_BUCKET as string
  const res = await r2Client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  )

  const chunks: Uint8Array[] = []
  const body = res.Body
  if (!body) throw new Error('R2 object has no body')

  for await (const chunk of body as any) {
    chunks.push(chunk as Uint8Array)
  }

  return Buffer.concat(chunks)
}
