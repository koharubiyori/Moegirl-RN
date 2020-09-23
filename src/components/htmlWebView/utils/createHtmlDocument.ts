export interface CreateHtmlDocumentOptions {
  title?: string
  body: string
  css?: string[]
  js?: string[]
  injectedStyles?: string[]
  injectedScripts?: string[]
}

export default function createHtmlDocument(options: CreateHtmlDocumentOptions): string {
  const title = options.title || 'Document'
  const styleTagsStr = (options.css || []).map(item => `<link rel="stylesheet" type="text/css" href="${item}" />`).join('\n')
  const jsTagsStr = (options.js || []).map(item => `<script src="${item}"></script>`).join('\n')
  
  const injectedStyleTagsStr = (options.injectedStyles || []).map(item => `<style>${item}</style>`).join('\n')
  const injectedScriptTagsStr = (options.injectedScripts || []).map(item => `<script>${item}</script>`).join('\n')

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>${title}</title>
      ${styleTagsStr}
      ${injectedStyleTagsStr}
    </head>
      <body>${options.body}</body>
      ${jsTagsStr}
      ${injectedScriptTagsStr}
    </html>   
  `
}