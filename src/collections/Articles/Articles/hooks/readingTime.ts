import type { CollectionBeforeChangeHook } from 'payload'

/* -------------------------------------------------
   CONSTANTS
-------------------------------------------------- */

const WORDS_PER_MINUTE = 200
const MAX_READING_TIME_MINUTES = 60

const OPTIONAL_TEXT_FIELDS = ['intro', 'summary', 'editorialNotes'] as const
const BLOCK_TEXT_FIELDS = [
  'text',
  'content',
  'caption',
  'quote',
  'headline',
  'description',
  'body',
] as const

/* -------------------------------------------------
   LEXICAL TEXT EXTRACTION
-------------------------------------------------- */

function extractTextFromLexical(node: any, visited = new Set<any>()): string {
  if (!node || visited.has(node)) return ''
  visited.add(node)

  let text = ''

  if (typeof node.text === 'string') {
    text += ' ' + node.text
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      text += extractTextFromLexical(child, visited)
    }
  }

  return text
}

/* -------------------------------------------------
   BLOCK TEXT EXTRACTION
-------------------------------------------------- */

function extractTextFromBlock(block: any, visited = new Set<any>()): string {
  if (!block || typeof block !== 'object' || visited.has(block)) return ''
  visited.add(block)

  let text = ''

  // Explicit text fields
  for (const field of BLOCK_TEXT_FIELDS) {
    if (typeof block[field] === 'string') {
      text += ' ' + block[field]
    }
  }

  // Lexical block
  if (block.blockType === 'richText' && block.content?.root) {
    text += extractTextFromLexical(block.content.root)
  }

  // Nested arrays ONLY (avoid double-walking objects)
  for (const value of Object.values(block)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        text += extractTextFromBlock(item, visited)
      }
    }
  }

  return text
}

/* -------------------------------------------------
   HOOK
-------------------------------------------------- */

export const calculateReadingTime: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!data) return data

  // ------------------------------------------------
  // Only recalculate if content actually changed
  // ------------------------------------------------
  const contentChanged =
    data.contentBlocks !== originalDoc?.contentBlocks ||
    OPTIONAL_TEXT_FIELDS.some((field) => data[field] !== originalDoc?.[field])

  if (!contentChanged && typeof originalDoc?.readingTime === 'number') {
    data.readingTime = originalDoc.readingTime
    return data
  }

  let combinedText = ''

  // ------------------------------------------------
  // MAIN CONTENT BLOCKS
  // ------------------------------------------------
  if (Array.isArray(data.contentBlocks)) {
    for (const block of data.contentBlocks) {
      combinedText += extractTextFromBlock(block)
    }
  }

  // ------------------------------------------------
  // OPTIONAL TEXT FIELDS
  // ------------------------------------------------
  for (const field of OPTIONAL_TEXT_FIELDS) {
    if (typeof data[field] === 'string') {
      combinedText += ' ' + data[field]
    }
  }

  // ------------------------------------------------
  // CALCULATION
  // ------------------------------------------------
  const words = combinedText.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length

  const minutes = wordCount > 0 ? Math.ceil(wordCount / WORDS_PER_MINUTE) : 1

  data.readingTime = Math.min(Math.max(1, minutes), MAX_READING_TIME_MINUTES)

  return data
}
