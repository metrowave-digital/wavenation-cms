import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params

  // lookup category ID
  const category = await payload.find({
    collection: 'categories',
    limit: 1,
    where: { slug: { equals: slug } },
  })

  if (!category?.docs?.length) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  const categoryId = category.docs[0].id

  // get articles
  const articles = await payload.find({
    collection: 'articles',
    limit: 25,
    sort: '-publishedAt',
    where: {
      categories: { in: [categoryId] },
      editorialStatus: { equals: 'published' },
    },
    depth: 2,
  })

  return NextResponse.json({
    category: category.docs[0],
    articles: articles.docs,
  })
}
