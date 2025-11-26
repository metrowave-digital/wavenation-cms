// app/api/utils/slugify/route.ts
import slugify from 'slugify'

export async function POST(req: Request) {
  const { text } = await req.json()
  return Response.json({ slug: slugify(text, { lower: true }) })
}
