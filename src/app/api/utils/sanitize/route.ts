// app/api/utils/sanitize/route.ts
import sanitizeHtml from 'sanitize-html'

export async function POST(req: Request) {
  const { html } = await req.json()
  return Response.json({ clean: sanitizeHtml(html) })
}
