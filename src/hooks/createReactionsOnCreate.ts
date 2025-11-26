// src/hooks/createReactionsOnCreate.ts
import type { AfterChangeHook } from 'payload'

const REACTION_TARGETS = ['episodes', 'articles', 'films', 'series', 'posts', 'polls'] as const
type ReactionTarget = (typeof REACTION_TARGETS)[number]

export const createReactionsOnCreate: AfterChangeHook = async ({
  operation,
  req,
  collection,
  doc,
}) => {
  if (operation !== 'create') return doc

  const collSlug = collection?.slug as ReactionTarget

  if (!REACTION_TARGETS.includes(collSlug)) return doc

  await req.payload.create({
    collection: 'reactions',
    data: {
      targetCollection: collSlug,
      relatedDoc: {
        relationTo: collSlug,
        value: doc.id,
      },
      reactions: {
        like: 0,
        heart: 0,
        fire: 0,
        clap: 0,
      },
    },
  })

  return doc
}
