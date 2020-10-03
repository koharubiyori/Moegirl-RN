export interface ParsedEditComment {
  body: string
  section?: string
}

export default function parseEditComment(comment: string): ParsedEditComment {
  const sectionRegex = /\/\* (.+?) \*\//
  let body = comment.replace(sectionRegex, '').trim()
  return {
    body,
    ...(sectionRegex.test(comment) ? { section: comment.match(sectionRegex)![1] } : {})
  }
}