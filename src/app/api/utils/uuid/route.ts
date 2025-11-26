// app/api/utils/uuid/route.ts
import { randomUUID } from 'crypto'

export async function GET() {
  return Response.json({ uuid: randomUUID() })
}
