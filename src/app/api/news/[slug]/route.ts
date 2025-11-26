import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params

  const article = await payload.find({
    collection: 'articles',
    limit: 1,
    where: {
      slug: { equals: slug },
      editorialStatus: { equals: 'published' },
    },
    depth: 3, // get related shows, episodes, playlists
  })

  if (!article?.docs?.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(article.docs[0])
}
