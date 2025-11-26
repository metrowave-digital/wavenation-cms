// app/api/utils/time/route.ts
export async function GET() {
  return Response.json({ serverTime: new Date().toISOString() })
}
