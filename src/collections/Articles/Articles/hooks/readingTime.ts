import type { CollectionBeforeChangeHook } from 'payload'

/* -------------------------------------------------
   Helpers
-------------------------------------------------- */

function extractTextFromLexical(node: any): string {
  let text = ''

  if (!node) return text

  if (node.text && typeof node.text === 'string') {
    text += ' ' + node.text
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      text += extractTextFromLexical(child)
    }
  }

  return text
}

function extractTextFromBlock(block: any): string {
  let text = ''

  if (!block || typeof block !== 'object') return text

  // Common text fields across your blocks
  const TEXT_FIELDS = ['text', 'content', 'caption', 'quote', 'headline', 'description', 'body']

  for (const field of TEXT_FIELDS) {
    if (typeof block[field] === 'string') {
      text += ' ' + block[field]
    }
  }

  // Lexical Rich Text blocks
  if (block.blockType === 'richText' && block.content?.root) {
    text += extractTextFromLexical(block.content.root)
  }

  // Nested structures
  for (const value of Object.values(block)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        text += extractTextFromBlock(item)
      }
    }
  }

  return text
}

/* -------------------------------------------------
   Hook
-------------------------------------------------- */

export const calculateReadingTime: CollectionBeforeChangeHook = ({ data }) => {
  if (!data) return data

  let combinedText = ''

  // -----------------------------------------------
  // MAIN ARTICLE CONTENT (Blocks)
  // -----------------------------------------------
  if (Array.isArray(data.contentBlocks)) {
    for (const block of data.contentBlocks) {
      combinedText += extractTextFromBlock(block)
    }
  }

  // -----------------------------------------------
  // OPTIONAL: Legacy or sidebar text
  // -----------------------------------------------
  const OPTIONAL_TEXT_FIELDS = ['intro', 'summary', 'editorialNotes']

  for (const field of OPTIONAL_TEXT_FIELDS) {
    if (typeof data[field] === 'string') {
      combinedText += ' ' + data[field]
    }
  }

  // -----------------------------------------------
  // CALCULATE
  // -----------------------------------------------
  const words = combinedText.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length

  const minutes = wordCount > 0 ? Math.ceil(wordCount / 200) : 1

  data.readingTime = Math.max(1, minutes)

  return data
}
