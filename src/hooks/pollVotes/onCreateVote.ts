// src/hooks/pollVotes/onCreateVote.ts
import payload from 'payload'
import type { Poll, PollVote } from '@/payload-types'

export const onCreateVote = async ({ doc }: { doc: PollVote }) => {
  const { poll, optionIndex } = doc

  // ------------------------------
  // Normalize poll ID
  // ------------------------------
  const pollId =
    typeof poll === 'number' ? poll : typeof poll === 'string' ? Number(poll) : poll?.id

  if (!pollId || Number.isNaN(pollId)) {
    throw new Error(`Invalid poll reference: ${poll}`)
  }

  // ------------------------------
  // Load Poll
  // ------------------------------
  const pollDoc = (await payload.findByID({
    collection: 'polls',
    id: pollId,
  })) as Poll | null

  if (!pollDoc) {
    throw new Error(`Poll not found: ${pollId}`)
  }

  if (!pollDoc.options || !Array.isArray(pollDoc.options)) {
    throw new Error(`Poll ${pollId} has no options`)
  }

  if (!pollDoc.options[optionIndex]) {
    throw new Error(`Invalid option index ${optionIndex}`)
  }

  // ------------------------------
  // Increment values safely
  // ------------------------------
  const updatedOptions = [...pollDoc.options]
  const currentVotes = updatedOptions[optionIndex].votes ?? 0

  updatedOptions[optionIndex] = {
    ...updatedOptions[optionIndex],
    votes: currentVotes + 1,
  }

  const totalVotes = (pollDoc.totalVotes ?? 0) + 1

  // ------------------------------
  // Save poll
  // ------------------------------
  await payload.update({
    collection: 'polls',
    id: pollId,
    data: {
      totalVotes,
      options: updatedOptions,
    },
  })

  return doc
}
